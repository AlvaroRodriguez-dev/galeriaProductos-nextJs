'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Container, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert } from '@mui/material';

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formState, setFormState] = useState({ name: '', description: '', price: '' });

  const router = useRouter();

  // Función para obtener el listado de productos desde la API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError('Error al obtener los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // formulario de adición y modificación de productos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const method = selectedProduct ? 'PUT' : 'POST';
      const endpoint = selectedProduct ? `http://localhost:3000/api/products/${selectedProduct.id}` : 'http://localhost:3000/api/products';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        fetchProducts();
        setOpen(false);
      } else {
        setError('Error al guardar el producto');
      }
    } catch (error) {
      setError('Error en la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchProducts();
      } else {
        setError('Error al eliminar el producto');
      }
    } catch (error) {
      setError('Error en la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: any) => {
    setSelectedProduct(product || null);
    setFormState({
      name: product ? product.name : '',
      description: product ? product.description : '',
      price: product ? product.price : '',
    });
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>

      {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '1rem' }}
      >
        Adicionar Producto
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{ marginRight: '1rem' }}
                      onClick={() => handleOpenDialog(product)}
                    >
                      Modificar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(product.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo para adicionar o modificar productos */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{selectedProduct ? 'Modificar Producto' : 'Adicionar Producto'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Descripción"
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Precio"
            name="price"
            value={formState.price}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedProduct ? 'Modificar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
