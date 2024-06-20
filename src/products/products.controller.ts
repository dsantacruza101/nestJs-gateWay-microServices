import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const newProduct = await firstValueFrom(this.client.send(
      { cmd: 'create_product ' },
      createProductDto
    ).pipe(
      catchError(err => throwError(() => new RpcException(err)))
    ));

    return newProduct;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {

    // Manejo de error con Observables
    const product = await firstValueFrom(this.client.send({ cmd: 'find_one_product' }, { id: id }).pipe(
      catchError(err => throwError(() => new RpcException(err)))
    ));

    return product;

    // Manejo de errores con catch/try
    // try {
    //   const product = await firstValueFrom(this.productsClient.send(
    //     { cmd: 'find_one_product' },
    //     { id: id }
    //   ));
    //   return product;
    // } catch (error) {
    //   throw new RpcException(error)
    // }

  }

  @Get()
  async findAllProducts(@Query() paginationDto: PaginationDto) {

    const allProducts = await firstValueFrom(this.client.send(
      { cmd: 'find_all_products' },
      paginationDto,
    ).pipe(
      catchError(err => throwError(() => new RpcException(err)))
    ))

    return allProducts;
    // Retornar de manera asyncrona
    // return this.productsClient.send(
    //   { cmd: 'find_all_products' },
    //   paginationDto,
    // );
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductDto: UpdateProductDto) {
    
    const updateProduct = await firstValueFrom(this.client.send(
      { cmd: 'update_product' },
      { id,
        ...updateProductDto
      }).pipe(
      catchError( err => throwError(() => new RpcException(err)))
    ));

    return updateProduct;
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    
    // return this.productsClient.send({ cms: 'delete_product' },{id}).pipe(
    //   catchError(err => throwError(() => new RpcException(err)))
    // )

    const deleteProduct = await firstValueFrom(this.client.send(
      { cmd: 'delete_product' }, 
      {id: id}).pipe(
      catchError( err => throwError(() => new RpcException(err)))
    ));

    return deleteProduct;

  }
}
