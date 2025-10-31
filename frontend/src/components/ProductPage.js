// src/components/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot
} from '@mui/lab';

function ProductPage() {
    const { batch_id } = useParams();
    const [chain, setChain] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Add this simple hash verification function ---
    const verifyChain = (productChain) => {
        for (let i = 1; i < productChain.length; i++) {
            const currentEntry = productChain[i];
            const previousEntry = productChain[i - 1];

            // Check if the previous_hash matches the last entry's hash
            if (currentEntry.previous_hash !== previousEntry.current_hash) {
                // If it doesn't match, mark this entry as tampered
                productChain[i].tampered = true;
            }
        }
        return productChain;
    };

    useEffect(() => {
        const fetchChain = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/chain/${batch_id}`);
                let data = await response.json();
                
                // Verify the chain!
                if (data.length > 0) {
                    data = verifyChain(data);
                }
                
                setChain(data);
            } catch (error) {
                console.error("Error fetching chain:", error);
            }
            setLoading(false);
        };
        fetchChain();
    }, [batch_id]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}><CircularProgress /></Box>;
    }

    if (chain.length === 0) {
        return <Typography variant="h5" align="center" sx={{ marginTop: 5 }}>No product history found for Batch ID: {batch_id}</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ marginTop: 4 }}>
                Product History: {batch_id}
            </Typography>
            <Timeline position="alternate">
                {chain.map((entry, index) => (
                    <TimelineItem key={entry._id}>
                        <TimelineSeparator>
                            {/* Use a red dot if tampered, green if first, blue otherwise */}
                            <TimelineDot color={entry.tampered ? 'error' : (index === 0 ? 'success' : 'primary')} />
                            {index < chain.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper elevation={3} sx={{ padding: '10px 16px', borderColor: entry.tampered ? 'red' : 'inherit', borderWidth: entry.tampered ? 2 : 0, borderStyle: 'solid' }}>
                                <Typography variant="h6" component="span">
                                    {entry.role}
                                </Typography>
                                <Typography color="textSecondary" sx={{ fontSize: '0.9rem' }}>
                                    {new Date(entry.timestamp).toLocaleString()}
                                </Typography>
                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                                    {JSON.stringify(entry.data, null, 2)}
                                </pre>
                                <Typography variant="caption" display="block" sx={{ wordBreak: 'break-all', color: entry.tampered ? 'red' : 'inherit' }}>
                                    {entry.tampered ? '!!! TAMPERED BLOCK !!!' : `Hash: ${entry.current_hash.substring(0, 12)}...`}
                                </Typography>
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Container>
    );
}
export default ProductPage;