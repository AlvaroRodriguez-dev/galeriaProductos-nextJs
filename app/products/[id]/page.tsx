'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Container, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

// Función para obtener el producto por su ID
async function getProduct(id: string) {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: 'no-store', 
  });

  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }

  return res.json();
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const router = useRouter(); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(params.id);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [params.id]);

  if (!product) {
    return <p>Cargando producto...</p>;
  }

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h4" component="h1">
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>
          <Typography variant="h5" color="primary">
            ${product.price}
          </Typography>
        </CardContent>
        <Button
          variant="contained"
          color="secondary"
          style={{ margin: '1rem' }}
          onClick={() => router.back()} 
        >
          Volver
        </Button>
      </Card>
    </Container>
  );
}
