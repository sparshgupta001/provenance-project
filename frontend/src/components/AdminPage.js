// src/components/AdminPage.js
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Container,
    Box,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Paper
} from '@mui/material';

function AdminPage() {
    const [batchId, setBatchId] = useState('');
    const [role, setRole] = useState('Farmer');
    const [data, setData] = useState('');
    const [message, setMessage] = useState('');
    const [qrValue, setQrValue] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        let parsedData;
        try {
            parsedData = JSON.parse(data);
        } catch (error) {
            setMessage('Error: Data must be valid JSON.');
            return;
        }

        const response = await fetch('http://localhost:5000/api/entry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                batch_id: batchId,
                role: role,
                data: parsedData
            }),
        });

        if (response.ok) {
            setMessage(`Successfully added entry for ${batchId}!`);
            if (role === 'Retailer') {
                const productUrl = `http://localhost:3000/product/${batchId}`;
                setQrValue(productUrl);
            }
            // Clear inputs after success
            setBatchId('');
            setData('');
            setRole('Farmer');
        } else {
            setMessage('Error adding to chain.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Add Supply Chain Entry
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Batch ID"
                        variant="outlined"
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                        required
                        fullWidth
                    />
                    <FormControl fullWidth required>
                        <InputLabel id="role-select-label">Role</InputLabel>
                        <Select
                            labelId="role-select-label"
                            value={role}
                            label="Role"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="Farmer">Farmer</MenuItem>
                            <MenuItem value="Co-op">Co-op</MenuItem>
                            <MenuItem value="Exporter">Exporter</MenuItem>
                            <MenuItem value="Retailer">Retailer</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Data (as JSON)"
                        variant="outlined"
                        multiline
                        rows={5}
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        placeholder='e.g., {"farm": "Green Valley", "organic": true}'
                        required
                        fullWidth
                    />
                    <Button type="submit" variant="contained" size="large">
                        Add Entry
                    </Button>
                </Box>
                {message && <Typography color="textSecondary" align="center" sx={{ marginTop: 2 }}>{message}</Typography>}
                {qrValue && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 3 }}>
                        <Typography variant="h6">Product QR Code:</Typography>
                        <QRCodeSVG value={qrValue} size={128} />
                        <Typography variant="caption" sx={{ marginTop: 1 }}>Scan to see product history</Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}
export default AdminPage;