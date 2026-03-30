export interface EmailAddress {
  name?: string;
  address: string;
}

export interface EmailAttachment {
  filename?: string;
  size?: string;
  contentType?: string;
}

export interface Email {
  id: string;
  from: string;
  from_parsed?: EmailAddress[];
  to: string;
  to_parsed?: EmailAddress[];
  cc?: string;
  subject?: string;
  date: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
  [key: string]: any;
}

export interface EmailsResponse {
  emails: Email[];
}
