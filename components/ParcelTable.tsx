'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { deleteParcel } from '@/app/actions';

interface Parcel {
  $id: string;
  parcel_code: string;
  sender_name: string;
  receiver_name: string;
  receiver_contact: string;
  parcel_office_name: string;
  status: string;
  weight: string;
  $createdAt: string;
}

const STATUS_COLORS: Record<string, { color: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error'; label: string }> = {
  pending: { color: 'default', label: 'Pending' },
  received: { color: 'primary', label: 'Received' },
  in_transit: { color: 'info', label: 'In Transit' },
  out_for_delivery: { color: 'warning', label: 'Out for Delivery' },
  delivered: { color: 'success', label: 'Delivered' },
};

export default function ParcelTable({ initialParcels }: { initialParcels: Parcel[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = initialParcels.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.parcel_code.toLowerCase().includes(q) ||
      p.sender_name.toLowerCase().includes(q) ||
      p.receiver_name.toLowerCase().includes(q) ||
      p.parcel_office_name.toLowerCase().includes(q)
    );
  });

  const handleDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteParcel(deleteId);
      setDeleteId(null);
      router.refresh();
    });
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          placeholder="Search by code, name, or office…"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, maxWidth: 360, bgcolor: '#ffffff' }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/parcel-office/enter-record')}
          sx={{ bgcolor: '#334155', '&:hover': { bgcolor: '#1e293b' }, whiteSpace: 'nowrap' }}
        >
          New Record
        </Button>
      </Box>

      <Paper sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Parcel Code</TableCell>
                <TableCell>Sender</TableCell>
                <TableCell>Receiver</TableCell>
                <TableCell>Office</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                    {search ? 'No parcels match your search.' : 'No parcel records yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((parcel) => {
                  const status = STATUS_COLORS[parcel.status] ?? { color: 'default', label: parcel.status };
                  return (
                    <TableRow
                      key={parcel.$id}
                      hover
                      sx={{ '&:last-child td': { borderBottom: 0 } }}
                    >
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, fontSize: 14, fontFamily: 'monospace' }}>
                          {parcel.parcel_code}
                        </Typography>
                      </TableCell>
                      <TableCell>{parcel.sender_name}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography sx={{ fontSize: 14 }}>{parcel.receiver_name}</Typography>
                          <Typography sx={{ fontSize: 12, color: '#94a3b8' }}>{parcel.receiver_contact}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{parcel.parcel_office_name}</TableCell>
                      <TableCell>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{parcel.weight ? `${parcel.weight} kg` : '—'}</TableCell>
                      <TableCell>{formatDate(parcel.$createdAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/parcel-office/parcels/${parcel.$id}/edit`)}
                          sx={{ color: '#64748b', mr: 0.5 }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setDeleteId(parcel.$id)}
                          sx={{ color: '#ef4444' }}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filtered.length > 0 && (
          <Box sx={{ px: 3, py: 1.5, borderTop: '1px solid #f1f5f9', bgcolor: '#fafafa' }}>
            <Typography sx={{ fontSize: 13, color: '#94a3b8' }}>
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Parcel Record</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#475569' }}>
            This action cannot be undone. The parcel record will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            disabled={isPending}
            sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
