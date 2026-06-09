'use client';

import { usePathname, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DRAWER_WIDTH = 256;

const navItems = [
  {
    label: 'Enter Record',
    icon: <AddBoxOutlinedIcon fontSize="small" />,
    href: '/parcel-office/enter-record',
  },
  {
    label: 'All Parcels',
    icon: <ListAltIcon fontSize="small" />,
    href: '/parcel-office/parcels',
  },
];

const pageTitles: Record<string, string> = {
  '/parcel-office/enter-record': 'Enter New Record',
  '/parcel-office/parcels': 'All Parcels',
};

export default function ParcelOfficeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const pageTitle = pageTitles[pathname] ?? 'Parcel Office';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#1e293b',
            border: 'none',
          },
        }}
      >
        {/* Brand */}
        <Box sx={{ px: 2.5, py: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: 1.5, bgcolor: '#334155',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <LocalShippingIcon sx={{ fontSize: 20, color: '#93c5fd' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#f1f5f9', fontSize: 15, lineHeight: 1.2 }}>
              ParcelManager
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: 12 }}>
              Office Portal
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#334155', mx: 2 }} />

        {/* Nav label */}
        <Typography
          sx={{
            px: 3, pt: 2.5, pb: 1, fontSize: 11, fontWeight: 600,
            color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em',
          }}
        >
          Management
        </Typography>

        {/* Nav items */}
        <List sx={{ px: 1.5, pb: 2 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => router.push(item.href)}
                  sx={{
                    borderRadius: 1.5,
                    px: 2,
                    py: 1.1,
                    bgcolor: isActive ? '#334155' : 'transparent',
                    '&:hover': { bgcolor: '#334155' },
                  }}
                >
                  <ListItemIcon
                    sx={{ color: isActive ? '#93c5fd' : '#64748b', minWidth: 34 }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? '#f1f5f9' : '#94a3b8' }}>
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Back to home */}
        <Box sx={{ mt: 'auto', px: 1.5, pb: 3 }}>
          <Divider sx={{ borderColor: '#334155', mb: 2 }} />
          <ListItemButton
            onClick={() => router.push('/')}
            sx={{ borderRadius: 1.5, px: 2, py: 1, '&:hover': { bgcolor: '#334155' } }}
          >
            <ListItemIcon sx={{ color: '#64748b', minWidth: 34 }}>
              <ArrowBackIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 13, color: '#64748b' }}>Back to Home</Typography>
              }
            />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc', minWidth: 0 }}>
        {/* Top AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            color: '#0f172a',
          }}
        >
          <Toolbar sx={{ minHeight: 60, px: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 16, color: '#0f172a' }}>
              {pageTitle}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography sx={{ fontSize: 13, color: '#64748b' }}>Parcel Office</Typography>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
