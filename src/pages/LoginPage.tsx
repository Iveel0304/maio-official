import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/admin');
    }
  };
  
  return (
    <Layout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Admin Login' : 'Админ нэвтрэх'}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Sign in to access the admin dashboard'
                  : 'Удирдлагын самбарт хандах нэвтрэх'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="username">
                    {language === 'en' ? 'Username' : 'Хэрэглэгчийн нэр'}
                  </Label>
                  <Input 
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={language === 'en' ? 'Enter your username' : 'Хэрэглэгчийн нэрээ оруулна уу'}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {language === 'en' ? 'Password' : 'Нууц үг'}
                  </Label>
                  <Input 
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === 'en' ? 'Enter your password' : 'Нууц үгээ оруулна уу'}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {language === 'en' ? 'Sign In' : 'Нэвтрэх'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}