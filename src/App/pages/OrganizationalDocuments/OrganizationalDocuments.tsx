import { formatBytes } from 'App/utils/formatBytes';
import { formatDate } from 'App/utils/formatDate';
import classNames from 'classnames';
import Button from 'components/Button';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import Modal from 'components/Modal';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useRootStore } from 'store/RootStore/RootStore';

import styles from './OrganizationalDocuments.module.scss';

const OrganizationalDocuments = observer(() => {
  const { documentsStore, userStore } = useRootStore();

  const [page, setPage] = useState(1);
  const limit = 10;

  const [searchQuery, setSearchQuery] = useState('');

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<{ id: string; name: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const skip = (page - 1) * limit;
    documentsStore.getDocsList(skip, limit);
  }, [documentsStore, page]);

  const filteredDocs = documentsStore.docs.filter((doc) =>
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append('file', file);

      await documentsStore.uploadDoc(formData);
      setUploadModalOpen(false);
      documentsStore.getDocsList((page - 1) * limit, limit);
    }
  };

  const handleDeleteConfirm = async () => {
    if (docToDelete) {
      await documentsStore.deleteDoc(docToDelete.id);
      setDeleteModalOpen(false);
      setDocToDelete(null);
    }
  };

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(1, prev - 1));

  const canManageDocs = userStore.canManageDocuments;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Организационные документы</h2>
      </div>

      <div className={styles.toolbar}>
        <Input
          icon={<Search />}
          placeholder="Поиск по документам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        {canManageDocs && <Button onClick={() => setUploadModalOpen(true)}>Загрузить файл</Button>}
      </div>

      {documentsStore.isLoading && documentsStore.docs.length === 0 ? (
        <div className={styles.loader}>Загрузка документов...</div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Название файла</th>
                  <th>Размер</th>
                  <th>Тип</th>
                  <th>Дата загрузки</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className={styles.row}>
                      <td>
                        <button
                          className={classNames(styles.downloadLink, styles.ellipsis)}
                          onClick={() => documentsStore.downloadDoc(doc.id, doc.fileName)}
                        >
                          {doc.fileName}
                        </button>
                      </td>
                      <td className={styles.secondaryText}>{formatBytes(doc.fileSize)}</td>
                      <td className={styles.secondaryText}>{doc.contentType}</td>
                      <td className={styles.secondaryText}>{formatDate(doc.createdAt)}</td>

                      {canManageDocs && (
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => {
                              setDocToDelete({ id: doc.id, name: doc.fileName });
                              setDeleteModalOpen(true);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ff4d4f',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                            }}
                            title="Удалить файл"
                          >
                            ✕
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className={styles.emptyState}>
                      Документы не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={handlePrevPage}
              disabled={page === 1 || documentsStore.isLoading}
            >
              ← Назад
            </button>
            <span className={styles.pageInfo}>Страница {page}</span>
            <button
              className={styles.pageBtn}
              onClick={handleNextPage}
              disabled={documentsStore.docs.length < limit || documentsStore.isLoading}
            >
              Вперед →
            </button>
          </div>
        </>
      )}

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} size="small">
        <div style={{ textAlign: 'center' }}>
          <h3>Подтверждение удаления</h3>
          <p style={{ margin: '16px 0 24px', color: '#666' }}>
            Вы уверены, что хотите удалить файл{' '}
            <p className={styles.ellipsis}>
              <b>"{docToDelete?.name}"</b>
            </p>
            ? Это действие нельзя будет отменить.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button
              onClick={() => setDeleteModalOpen(false)}
              style={{ background: '#f5f5f5', color: '#333', border: '1px solid #d9d9d9' }}
            >
              Отменить
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={documentsStore.isLoading}
              style={{ background: '#ff4d4f', color: '#fff', border: 'none' }}
            >
              {documentsStore.isLoading ? 'Удаление...' : 'Да, удалить'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} size="small">
        <div>
          <h3 style={{ marginBottom: '16px' }}>Загрузить новый документ</h3>
          <form onSubmit={handleUploadSubmit}>
            <div
              style={{
                padding: '24px',
                border: '2px dashed #d9d9d9',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                required
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                style={{ background: '#f5f5f5', color: '#333', border: '1px solid #d9d9d9' }}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={documentsStore.isLoading}>
                {documentsStore.isLoading ? 'Загрузка...' : 'Загрузить файл'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
});

export default OrganizationalDocuments;
