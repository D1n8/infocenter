export type DocTypeApi = {
  id: string;
  file_name: string;
  file_size: number;
  content_type: string;
  created_at: string;
  uploaded_by: string;
};

export type DocTypeModel = {
  id: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  createdAt: string;
  uploadedBy: string;
};

export const normalizeDocType = (doc: DocTypeApi): DocTypeModel => {
  return {
    id: doc.id,
    fileName: doc.file_name,
    fileSize: doc.file_size,
    contentType: doc.content_type,
    createdAt: doc.created_at,
    uploadedBy: doc.uploaded_by,
  };
};

export type DocInfoApi = DocTypeApi & {
  minio_url: string;
};

export type DocInfoModel = DocTypeModel & {
  minioUrl: string;
};

export const normalizeDocInfo = (docInfo: DocInfoApi): DocInfoModel => {
  return {
    id: docInfo.id,
    fileName: docInfo.file_name,
    fileSize: docInfo.file_size,
    contentType: docInfo.content_type,
    minioUrl: docInfo.minio_url,
    createdAt: docInfo.created_at,
    uploadedBy: docInfo.uploaded_by,
  };
};
