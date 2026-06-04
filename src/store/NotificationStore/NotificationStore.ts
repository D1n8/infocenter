import { api } from 'config/api';
import { computed, makeObservable, observable, runInAction } from 'mobx';

export type NotificationType = {
  id: string;
  type: string;
  recipient_id: string;
  actor_id: string;
  diagram_id: string;
  message: string;
  data: {
    diagram_id: string;
  };
  timestamp: string;
  delivered_at: string | null;
};

type PrivateFields = '_socket' | '_notifications' | '_isConnected' | '_unreadCount';

export default class NotificationStore {
  private _socket: WebSocket | null = null;
  private _notifications: NotificationType[] = [];
  private _isConnected = false;
  private _unreadCount = 0;

  constructor() {
    makeObservable<NotificationStore, PrivateFields>(this, {
      _socket: observable,
      _notifications: observable,
      _isConnected: observable,
      _unreadCount: observable,

      notifications: computed,
      isConnected: computed,
      unreadCount: computed,
    });
  }

  get notifications(): NotificationType[] {
    return this._notifications;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  get unreadCount(): number {
    return this._unreadCount;
  }

  setInitialNotifications(notifications: NotificationType[]) {
    runInAction(() => {
      this._notifications = notifications;
      this._unreadCount = notifications.length;
    });
  }

  async fetchAllNotifications() {
    try {
      const response = await api.get<NotificationType[]>('/notifications/');
      runInAction(() => {
        this._notifications = response.data;
      });
    } catch {
      // Игнорируем ошибки сети
    }
  }

  async fetchPendingNotifications() {
    try {
      const response = await api.get<NotificationType[]>('/notifications/pending');
      runInAction(() => {
        if (response.data.length > 0) {
          // Создаем абсолютно новый массив, чтобы гарантировать перерендер React
          this._notifications = [...response.data, ...this._notifications];
          this._unreadCount += response.data.length;
        }
      });
    } catch {
      // Игнорируем ошибки сети
    }
  }

  resetUnreadCount() {
    runInAction(() => {
      this._unreadCount = 0;
    });
  }

  connect() {
    if (this._socket) {
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      return;
    }

    const wsUrl = `wss://project-domain.ru/ws/notifications?token=${token}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      runInAction(() => {
        this._isConnected = true;
      });
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data);
        // На случай, если бэк решит прислать массив вместо объекта
        const incomingData = Array.isArray(parsed) ? parsed : [parsed];

        runInAction(() => {
          let addedCount = 0;
          let newNotifs = [...this._notifications]; // Копируем старые

          incomingData.forEach((data: NotificationType) => {
            // Если id нет (баг бэка), придумываем свой
            if (!data.id) data.id = Date.now().toString() + Math.random().toString();

            newNotifs = [data, ...newNotifs]; // Добавляем в начало нового массива
            addedCount += 1;
          });

          // Жестко меняем ссылку на массив - это 100% вызовет перерендер в MobX!
          this._notifications = newNotifs;
          this._unreadCount += addedCount;
        });
      } catch {
        // Ошибка парсинга
      }
    };

    socket.onclose = () => {
      runInAction(() => {
        this._isConnected = false;
        this._socket = null;
      });
    };

    socket.onerror = () => {
      socket.close();
    };

    this._socket = socket;
  }

  disconnect() {
    if (this._socket) {
      this._socket.close();
      runInAction(() => {
        this._socket = null;
        this._isConnected = false;
        this._notifications = [];
        this._unreadCount = 0;
      });
    }
  }
}
