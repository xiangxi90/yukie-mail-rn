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

export type mail_protocal = 'SSL/TLS' | 'StartTls' | 'None';
export type Account = {
  name: string;
  status: 'Success' | 'Empty' | 'Expired';
  email_address: string;
  smtp_server: string;
  smtp_account: string;
  smtp_port: number;
  smtp_password: string;
  smtp_protocol: mail_protocal;
  imap_server: string;
  imap_port: number;
  imap_account: string;
  imap_password: string;
  imap_protocol: mail_protocal;
};

export type Message = {
  id: string;
  labels: string[];
  subject: string;
  from: MailAdrress;
  to: MailAdrress[];
  cc?: MailAdrress[];
  bcc?: MailAdrress[];
  body: string;
  content?: Content[]; // 存储文件地址
  flaged?: Boolean;
  time?: number;
};

export type MailAdrress = {
  name: string;
  address: string;
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
