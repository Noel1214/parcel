import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EditParcelForm from '@/components/EditParcelForm';
import { getParcel } from '@/app/actions';

export default async function EditParcelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let parcel;
  try {
    parcel = await getParcel(id);
  } catch {
    return (
      <Box sx={{ p: 4, borderRadius: 2, border: '1px solid #fecaca', bgcolor: '#fef2f2' }}>
        <Typography sx={{ color: '#dc2626' }}>
          Parcel not found or could not be loaded.
        </Typography>
      </Box>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <EditParcelForm parcel={parcel as any} />;
}
