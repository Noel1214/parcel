'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export default function HomeCards() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
      }}
    >
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1 }}>
          <LocalShippingIcon sx={{ fontSize: 32, color: '#334155' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: -0.5 }}>
            Parcel Manager
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Select your role to continue
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mt: 3 }}>
        <Card
          sx={{
            width: 280,
            border: '1px solid #e2e8f0',
            borderRadius: 3,
            transition: 'border-color 0.15s, box-shadow 0.15s',
            '&:hover': { borderColor: '#94a3b8', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
          }}
        >
          <CardActionArea onClick={() => router.push('/parcel-office')} sx={{ p: 1 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  width: 64, height: 64, borderRadius: '50%', bgcolor: '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 2.5,
                }}
              >
                <LocalShippingIcon sx={{ fontSize: 30, color: '#334155' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 1 }}>
                Parcel Office
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                Manage incoming parcels, enter records, update status and details.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card
          sx={{
            width: 280,
            border: '1px solid #e2e8f0',
            borderRadius: 3,
            transition: 'border-color 0.15s, box-shadow 0.15s',
            '&:hover': { borderColor: '#94a3b8', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
          }}
        >
          <CardActionArea onClick={() => router.push('/sender')} sx={{ p: 1 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  width: 64, height: 64, borderRadius: '50%', bgcolor: '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 2.5,
                }}
              >
                <PersonSearchIcon sx={{ fontSize: 30, color: '#334155' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 1 }}>
                Senders
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                Track your parcel using the parcel code and get office contact details.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Box>
  );
}
