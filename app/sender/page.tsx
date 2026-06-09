'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { searchParcelByCode } from '@/app/actions';

const STATUS_META: Record<string, { color: 'default' | 'primary' | 'success' | 'warning' | 'info'; label: string }> = {
  pending: { color: 'default', label: 'Pending' },
  received: { color: 'primary', label: 'Received at Office' },
  in_transit: { color: 'info', label: 'In Transit' },
  out_for_delivery: { color: 'warning', label: 'Out for Delivery' },
  delivered: { color: 'success', label: 'Delivered' },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Parcel = Record<string, any>;

export default function SenderPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState('');
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setNotFound(false);
    setError('');
    setParcel(null);
    startTransition(async () => {
      try {
        const result = await searchParcelByCode(code.trim());
        if (result) {
          setParcel(result);
        } else {
          setNotFound(true);
        }
      } catch {
        setError('Could not search at this time. Please try again.');
      }
    });
  };

  const statusMeta = parcel ? (STATUS_META[parcel.status] ?? { color: 'default' as const, label: parcel.status }) : null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 3,
        pt: 6,
        pb: 8,
      }}
    >
      {/* Back */}
      <Box sx={{ width: '100%', maxWidth: 560, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
          sx={{ color: '#64748b', '&:hover': { bgcolor: '#f1f5f9' } }}
        >
          Back
        </Button>
      </Box>

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 5, width: '100%', maxWidth: 560 }}>
        <Box
          sx={{
            width: 56, height: 56, borderRadius: '50%', bgcolor: '#f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
          }}
        >
          <LocalShippingIcon sx={{ fontSize: 26, color: '#334155' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          Track Your Parcel
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Enter your parcel code to see its current status and office details.
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ width: '100%', maxWidth: 560 }}>
        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
            <TextField
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter parcel code, e.g. PCL-2024-001"
              fullWidth
              size="medium"
              sx={{ bgcolor: '#ffffff' }}
              slotProps={{
                input: {
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', color: '#94a3b8' }}>
                      <SearchIcon fontSize="small" />
                    </Box>
                  ),
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isPending || !code.trim()}
              sx={{
                px: 3, bgcolor: '#334155', '&:hover': { bgcolor: '#1e293b' },
                whiteSpace: 'nowrap', minWidth: 110,
              }}
            >
              {isPending ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Track'}
            </Button>
          </Box>
        </form>

        {/* Error */}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Not found */}
        {notFound && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            No parcel found with code <strong>{code}</strong>. Please check and try again.
          </Alert>
        )}

        {/* Result */}
        {parcel && statusMeta && (
          <Paper
            sx={{
              border: '1px solid #e2e8f0',
              borderRadius: 2.5,
              overflow: 'hidden',
            }}
          >
            {/* Status banner */}
            <Box
              sx={{
                px: 3.5, py: 2.5,
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 12, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Parcel Code
                </Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                  {parcel.parcel_code}
                </Typography>
              </Box>
              <Chip
                label={statusMeta.label}
                color={statusMeta.color}
                sx={{ fontWeight: 600, fontSize: 13 }}
              />
            </Box>

            <Box sx={{ px: 3.5, py: 3 }}>
              {/* Office details */}
              <Typography
                sx={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 }}
              >
                Parcel Office
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <DetailRow
                  icon={<LocalShippingIcon fontSize="small" />}
                  label="Office Name"
                  value={parcel.parcel_office_name}
                />
                <DetailRow
                  icon={<PhoneOutlinedIcon fontSize="small" />}
                  label="Contact"
                  value={parcel.parcel_office_contact}
                />
                <DetailRow
                  icon={<LocationOnOutlinedIcon fontSize="small" />}
                  label="Address"
                  value={parcel.parcel_office_address}
                />
              </Box>

              <Divider sx={{ borderColor: '#f1f5f9', mb: 3 }} />

              {/* Parcel details */}
              <Typography
                sx={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 }}
              >
                Parcel Details
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <DetailRow
                  icon={<PersonOutlinedIcon fontSize="small" />}
                  label="Sender"
                  value={parcel.sender_name}
                />
                <DetailRow
                  icon={<PersonOutlinedIcon fontSize="small" />}
                  label="Receiver"
                  value={`${parcel.receiver_name} · ${parcel.receiver_contact}`}
                />
                {parcel.weight && (
                  <DetailRow icon={null} label="Weight" value={`${parcel.weight} kg`} />
                )}
                {parcel.description && (
                  <DetailRow icon={null} label="Description" value={parcel.description} />
                )}
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
      {icon && (
        <Box sx={{ color: '#94a3b8', mt: 0.2, flexShrink: 0 }}>{icon}</Box>
      )}
      {!icon && <Box sx={{ width: 20, flexShrink: 0 }} />}
      <Box>
        <Typography sx={{ fontSize: 12, color: '#94a3b8', mb: 0.3 }}>{label}</Typography>
        <Typography sx={{ fontSize: 15, color: '#0f172a', fontWeight: 500 }}>{value || '—'}</Typography>
      </Box>
    </Box>
  );
}
