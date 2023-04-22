// 联系人
export type Contact = {
  name: string;
  jobTitle: string;
  address: string;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  photos: string[];
};

export type Calendar = {
  title: string;
  start: Date;
  end: Date;
};

export type Content = {
  type: 'image' | 'music' | 'file';
  path: string;
  name: string;
};

export type Account = {
  name: string;
  statue: 'Success' | 'Empty' | 'Expired';
  email_address: string;
  smtp_server: string;
  smtp_port: number;
  smtp_password: string;
  imap_server: string;
  imap_port: number;
  imap_password: string;
};

export type Message = {
  id: string;
  labels: string[];
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  body: string;
  content?: Content; // 存储文件地址
};

export type Thread = {
  thread_id: string;
  label_id: string;
  summary: string;
  message_count: number;
  unread_count: number;
  is_flaged: boolean;
  from: string;
  to: string;
};

export type RootStackParamList = {};
