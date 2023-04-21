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

export type Message = {
  id: string;
  subject: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  body: string;
  content?: Blob;
};

export type RootStackParamList = {};
