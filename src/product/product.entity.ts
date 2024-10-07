import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Category } from 'src/category/category.entity';

@Entity()
export class Product {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('double')
  price: number;

  @Column(() => Category)
  category: Category;

  @Column('int')
  stock: number;
}
