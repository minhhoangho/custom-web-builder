import { ReactNode } from 'react';

export interface FileItem {
  event?: typeof event; // xhr event
  fileInstance?: File; // original File Object which extends Blob, the file object actually obtained by the browser (https://developer.mozilla.org/zh-CN/docs/Web/API/File)
  name: string;
  percent?: number; // upload progress percentage
  preview: boolean; // Whether to preview according to url
  response?: any; // xhr's response, response body when the request is successful, and corresponding error when the request fails
  shouldUpload?: boolean; // Should you continue to upload
  showReplace?: boolean; // Separately control whether the file displays the replace button
  showRetry?: boolean; // Separately control whether the file displays the retry button
  size: string; // file size, unit kb
  status: string; //'success' |'uploadFail' |'validateFail' |'validating' |'uploading' |'wait';
  uid: string; // The unique identifier of the file. If the current file is selected and added by upload, the uid will be automatically generated. If it is defaultFileList, you need to ensure that it will not be repeated
  url: string;
  validateMessage?: ReactNode | string;
}
