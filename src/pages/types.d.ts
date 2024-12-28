import { WebAppUser } from '@twa-dev/sdk';

export interface ExtendedWebAppUser extends WebAppUser {
  id: number; // Kullanıcı ID'sini number olarak tanımlayın
  username?: string;
  first_name: string; // Kullanıcının ilk adı
  last_name?: string; // Kullanıcının soyadı
  language_code?: string; // Kullanıcının dil kodu
  
  photo?: {
    small_file_id: string;
    big_file_id: string;
  };
}
