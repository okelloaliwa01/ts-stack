import { Link, useLocation, useParams } from 'react-router-dom';

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function Breadcrumbs() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const pageName = location.pathname.split('/')[2];

  if (!pageName) return null;

  if (id) {
    return (
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={pageName} asChild={true}>
            <Link to={pageName}>
              {pageName}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>
            {id}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    );
  }

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbPage>
          {pageName || '404'}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}
