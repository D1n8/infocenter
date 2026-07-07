import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import PageTitle from 'components/PageTitle/PageTitle';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useRootStore } from 'store/RootStore/RootStore';
import layoutStyles from 'styles/shared/Layout.module.scss';
import type { LevelType, UnitTreeItem } from 'types/index';

import styles from './UnitsManagePage.module.scss';

const LEVEL_LABELS: Record<LevelType, string> = {
  enterprise: 'Предприятие',
  shop: 'Цех',
  area: 'Участок',
};

const getNextLevel = (current: LevelType): LevelType | null => {
  if (current === 'enterprise') return 'shop';
  if (current === 'shop') return 'area';
  return null;
};

const UnitsManagePage = observer(() => {
  const { unitStore } = useRootStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const [targetId, setTargetId] = useState<string | null>(null);
  const [targetLevel, setTargetLevel] = useState<LevelType>('enterprise');
  const [unitName, setUnitName] = useState('');

  useEffect(() => {
    unitStore.fetchUnitsTree();
  }, [unitStore]);

  const openCreateModal = (parentId: string | null, level: LevelType) => {
    setModalMode('create');
    setTargetId(parentId);
    setTargetLevel(level);
    setUnitName('');
    setIsModalOpen(true);
  };

  const openEditModal = (id: string, name: string) => {
    setModalMode('edit');
    setTargetId(id);
    setUnitName(name);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: string, name: string) => {
    setTargetId(id);
    setUnitName(name);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName.trim()) return;

    if (modalMode === 'create') {
      await unitStore.createUnit(unitName, targetLevel, targetId);
    } else if (modalMode === 'edit' && targetId) {
      await unitStore.updateUnit(targetId, unitName);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (targetId) {
      await unitStore.deleteUnit(targetId);
      setIsDeleteModalOpen(false);
    }
  };

  const renderTree = (nodes: UnitTreeItem[]) => {
    return (
      <div className={styles.treeList}>
        {nodes.map((node) => {
          const nextLevel = getNextLevel(node.level);
          return (
            <div key={node.id} className={styles.treeNode}>
              <div className={styles.nodeContent}>
                <div className={styles.nodeInfo}>
                  <span className={styles.nodeName}>{node.name}</span>
                  <span className={styles.badge}>{LEVEL_LABELS[node.level]}</span>
                </div>
                <div className={styles.actions}>
                  {nextLevel && (
                    <button
                      type="button"
                      className={styles.addBtn}
                      onClick={() => openCreateModal(node.id, nextLevel)}
                    >
                      + Добавить {LEVEL_LABELS[nextLevel]}
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={() => openEditModal(node.id, node.name)}
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => openDeleteModal(node.id, node.name)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
              {node.children && node.children.length > 0 && (
                <div className={styles.children}>{renderTree(node.children)}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <PageTitle title="Предприятия и структура" />

      <div className={layoutStyles.settingsContainer}>
        <div className={styles.headerToolbar}>
          <Button onClick={() => openCreateModal(null, 'enterprise')}>
            + Добавить предприятие
          </Button>
        </div>

        {unitStore.isLoading && unitStore.unitsTree.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8c8c8c' }}>
            Загрузка структуры...
          </div>
        ) : unitStore.unitsTree.length > 0 ? (
          <div className={styles.treeContainer}>{renderTree(unitStore.unitsTree)}</div>
        ) : (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: '#8c8c8c',
              border: '1px dashed #d9d9d9',
              borderRadius: '8px',
            }}
          >
            Структура пуста. Нажмите «Добавить предприятие», чтобы начать.
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="small">
        <div>
          <h3 style={{ marginBottom: '16px' }}>
            {modalMode === 'create' ? `Добавить ${LEVEL_LABELS[targetLevel]}` : 'Редактировать'}
          </h3>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '24px' }}>
              <Input
                placeholder="Введите название"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: '#f5f5f5', color: '#333', border: '1px solid #d9d9d9' }}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={unitStore.isLoading}>
                {unitStore.isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="small">
        <div style={{ textAlign: 'center' }}>
          <h3>Подтверждение удаления</h3>
          <p style={{ margin: '16px 0 24px', color: '#666' }}>
            Вы уверены, что хотите удалить <b>"{unitName}"</b>? Вложенные подразделения и
            привязанные диаграммы также могут быть удалены.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              style={{ background: '#f5f5f5', color: '#333', border: '1px solid #d9d9d9' }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={unitStore.isLoading}
              style={{ background: '#ff4d4f', color: '#fff', border: 'none' }}
            >
              {unitStore.isLoading ? 'Удаление...' : 'Да, удалить'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default UnitsManagePage;
