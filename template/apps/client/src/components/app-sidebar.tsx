import * as React from 'react';
import { Fragment, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ModeToggle } from '@/components/mode-toggle';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { toggleSidebar, isMobile } = useSidebar();

  const hideOnMobile = useCallback(() => {
    if (isMobile) {
      toggleSidebar();
    }
  }, [isMobile, toggleSidebar]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex justify-between">
          <ModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((page) => (
            <Fragment key={page.path}>
              <SidebarMenuItem className="list-none">
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === `/en/${page.path}`}
                >
                  <Link
                    to={`/en/${page.path}${page.params || ''}`}
                    onClick={hideOnMobile}
                  >
                    <page.icon />
                    <span>{page.path}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Fragment>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
