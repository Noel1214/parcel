'use client';

import { useState, useTransition } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { createParcel } from '@/app/actions';

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'received', label: 'Received at Office' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
];

const defaultForm = {
  parcel_code: '',
  sender_name: '',
  receiver_name: '',
  receiver_contact: '',
  parcel_office_name: '',
  parcel_office_contact: '',
  parcel_office_address: '',
  status: 'pending',
  weight: '',
  description: '',
  notes: '',
};

export default function EnterRecordPage() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(defaultForm);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    startTransition(async () => {
      try {
        await createParcel(form);
        setSuccess(true);
        setForm(defaultForm);
      } catch {
        setError('Failed to save parcel record. Check your Appwrite configuration.');
      }
    });
  };

  return (
    <Box sx={{ maxWidth: 820 }}>
      <Paper
        sx={{
          border: '1px solid #e2e8f0',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Form header */}
        <Box sx={{ px: 4, py: 3, borderBottom: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', fontSize: 17 }}>
            New Parcel Record
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Fill in all required fields to register an incoming parcel.
          </Typography>
        </Box>

        <Box sx={{ px: 4, py: 3.5, bgcolor: '#ffffff' }}>
          {success && (
            <Alert severity="success" onClose={() => setSuccess(false)} sx={{ mb: 3 }}>
              Parcel record saved successfully.
            </Alert>
          )}
          {error && (
            <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Section: Parcel Info */}
            <SectionLabel>Parcel Information</SectionLabel>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mb: 3.5 }}>
              <TextField
                label="Parcel Code"
                required
                value={form.parcel_code}
                onChange={set('parcel_code')}
                placeholder="e.g. PCL-2024-001"
                sx={{ flex: '1 1 280px' }}
              />
              <TextField
                label="Status"
                select
                required
                value={form.status}
                onChange={set('status')}
                sx={{ flex: '1 1 280px' }}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Weight (kg)"
                value={form.weight}
                onChange={set('weight')}
                placeholder="e.g. 2.5"
                sx={{ flex: '1 1 280px' }}
              />
              <TextField
                label="Description"
                value={form.description}
                onChange={set('description')}
                placeholder="Brief description of contents"
                sx={{ flex: '1 1 280px' }}
              />
            </Box>

            <Divider sx={{ mb: 3, borderColor: '#f1f5f9' }} />

            {/* Section: Sender & Receiver */}
            <SectionLabel>Sender &amp; Receiver</SectionLabel>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mb: 3.5 }}>
              <TextField
                label="Sender Name"
                required
                value={form.sender_name}
                onChange={set('sender_name')}
                sx={{ flex: '1 1 280px' }}
              />
              <TextField
                label="Receiver Name"
                required
                value={form.receiver_name}
                onChange={set('receiver_name')}
                sx={{ flex: '1 1 280px' }}
              />
              <TextField
                label="Receiver Contact"
                required
                value={form.receiver_contact}
                onChange={set('receiver_contact')}
                placeholder="Phone or email"
                sx={{ flex: '1 1 280px' }}
              />
            </Box>

            <Divider sx={{ mb: 3, borderColor: '#f1f5f9' }} />

            {/* Section: Office */}
            <SectionLabel>Parcel Office Details</SectionLabel>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mb: 3.5 }}>
              <TextField
                label="Office Name"
                required
                value={form.parcel_office_name}
                onChange={set('parcel_office_name')}
                sx={{ flex: '1 1 280px' }}
              />
              <TextField
                label="Office Contact"
                required
                value={form.parcel_office_contact}
                onChange={set('parcel_office_contact')}
                sx={{ flex: '1 1 280px' }}
              />
              <TextField
                label="Office Address"
                required
                value={form.parcel_office_address}
                onChange={set('parcel_office_address')}
                multiline
                rows={2}
                sx={{ flex: '1 1 100%' }}
              />
            </Box>

            <Divider sx={{ mb: 3, borderColor: '#f1f5f9' }} />

            {/* Section: Notes */}
            <SectionLabel>Additional Notes</SectionLabel>
            <Box sx={{ mb: 4 }}>
              <TextField
                label="Notes"
                value={form.notes}
                onChange={set('notes')}
                multiline
                rows={3}
                fullWidth
                placeholder="Any additional information..."
              />
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isPending}
                size="large"
                sx={{
                  px: 4,
                  bgcolor: '#334155',
                  '&:hover': { bgcolor: '#1e293b' },
                  minWidth: 140,
                }}
              >
                {isPending ? (
                  <CircularProgress size={18} sx={{ color: 'white' }} />
                ) : (
                  'Save Record'
                )}
              </Button>
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={() => { setForm(defaultForm); setError(''); setSuccess(false); }}
                sx={{
                  px: 4,
                  borderColor: '#cbd5e1',
                  color: '#475569',
                  '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' },
                }}
              >
                Clear
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 600,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );
}
