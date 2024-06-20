import { Controller, Get, Post, Body, Param, Inject, ParseIntPipe, ParseUUIDPipe, Query, Patch } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto)
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send({ cmd: 'findAllOrders'}, orderPaginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {

    const product = await firstValueFrom(this.client.send('findOneOrder', { id: id }).pipe(
      catchError(err => throwError(() => new RpcException(err)))
    ));

    return product;

  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    return this.client.send('changeOrderStatus', {
      id,
      status: statusDto.status
    }).pipe(
      catchError(err => throwError(() => new RpcException(err)))
    )
  }


}
