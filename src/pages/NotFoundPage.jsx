import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button, EmptyState } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <div className="container-page py-16">
      <EmptyState icon={Compass} title="Page not found" description="The page you are looking for doesn't exist or was moved." action={<Button as={Link} to="/">Back to home</Button>} />
    </div>
  );
}
