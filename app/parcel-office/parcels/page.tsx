import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ParcelTable from '@/components/ParcelTable';
import { getParcels } from '@/app/actions';

export default async function ParcelsPage() {
  let parcels: Awaited<ReturnType<typeof getParcels>> = [];
  let fetchError = '';

  try {
    parcels = await getParcels();
  } catch {
    fetchError = 'Could not load parcels. Check your Appwrite configuration.';
  }

  return (
    <Box>
      {fetchError ? (
        <Box
          sx={{
            p: 4, borderRadius: 2, border: '1px solid #fecaca',
            bgcolor: '#fef2f2', color: '#dc2626',
          }}
        >
          <Typography>{fetchError}</Typography>
        </Box>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <ParcelTable initialParcels={parcels as any} />
      )}
    </Box>
  );
}
