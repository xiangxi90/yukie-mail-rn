import {generateSchema} from 'typescript-json-schema';

const schema = generateSchema(MailMessageInfo);

type MailMessageInfo = {
  message_id: string;
  thread_id: string;
  reply_to_id: string;
  subject: string;
  from: string;
  to: string;
};

type ParseResult<T> =
  | {parsed: T; hasError: false; error?: undefined}
  | {parsed?: undefined; hasError: true; error?: unknown};
  
const safeJsonParse = <T>(typeguard: (o: any) => o is T) => (text: string): ParseResult<T> => {
    try {
        const parsed = JSON.parse(text)
        return typeguard(parsed) ? { parsed, hasError: false } : { hasError: true }
    } catch (error) {
        return { hasError: true, error }
    }
}
