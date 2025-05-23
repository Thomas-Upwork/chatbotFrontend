type ChatCompletionRole = 'system' | 'user' | 'assistant' | 'tool' | 'function';

export interface IMessage {
  role: ChatCompletionRole;
  content: string;
}
