'use client';

import React from 'react';
import Link from 'next/link';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Container } from '@mui/material';

// Función para obtener productos del servidor
async function getProducts() {
  const res = await fetch('http://localhost:3000/api/products', {
    cache: 'no-store', // Simula `getServerSideProps`
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

// Componente de la página de productos
export default async function ProductsPage() {
  const products = await getProducts();  // Realiza la petición al servidor

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Galería de Productos
      </Typography>
      <Grid container spacing={4}>
        {products.map((product: any) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="text.primary" sx={{ marginTop: '0.5rem' }}>
                  ${product.price}
                </Typography>
              </CardContent>

              {/* Enlace a la página de detalles */}
              <Link href={`/products/${product.id}`} passHref style={{ textDecoration: 'none' }}>
                <Button size="small" color="primary" variant="contained" style={{ margin: '1rem' }}>
                  Ver Detalles
                </Button>
              </Link>

            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
