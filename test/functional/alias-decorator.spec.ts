import 'reflect-metadata';
import {classToPlain, Expose, plainToClass, Type} from '../../src/index';
import { defaultMetadataStorage } from '../../src/storage';
import { Alias } from '../../src/decorators';

describe('alias functionality', () => {
  it('Tests alias instanceToPlain', () => {
    defaultMetadataStorage.clear();

    class User {
      id: number;

      @Alias({ name: 'fn' })
      firstName: string;
    }

    const instance = new User();
    instance.id = 123;
    instance.firstName = 'Alex';

    const plain = classToPlain(instance, {
      useAliases: true,
    });

    expect(plain.id).toEqual(123);
    expect(plain.firstName).toEqual(undefined);
    expect(plain.fn).toEqual('Alex');
  });

  it('Tests alias plainToInstance', () => {
    defaultMetadataStorage.clear();

    class User {
      id: number;

      @Alias({ name: 'fn' })
      firstName: string;
    }

    const plain = {
      id: 123,
      fn: 'Alex',
    };

    const instance = plainToClass(User, plain, {
      useAliases: true,
    });

    expect(instance.id).toEqual(123);
    expect(instance.firstName).toEqual('Alex');
  });

  it('Tests alias plainToInstance, for nested field', () => {
    defaultMetadataStorage.clear();

    class User {
      id: number;

      @Alias({ name: 'fn' })
      firstName: string;
    }

    class Order {
      @Alias({name: 'u'})
      @Type(() => User)
      user: User;
    }

    const plain = {
      u: {
        id: 123,
        fn: 'Alex',
      }
    };

    const instance = plainToClass(Order, plain, {
      useAliases: true,
    });

    expect(instance.user.id).toEqual(123);
    expect(instance.user.firstName).toStrictEqual('Alex');
  });

  it.only('Tests expossse', () => {
    defaultMetadataStorage.clear();

    class User {
      id: number;

      @Expose({ name: 'fn' })
      firstName: string;
    }

    class Order {
      @Expose({ name: 'u', since: 2 })
      @Type(() => User)
      user: User;
    }

    const plain = {
      u: {
        id: 123,
        fn: 'Alex',
      }
    };

    const instance = plainToClass(Order, plain);
    console.log(JSON.stringify(instance, null ,2));
    expect(instance.user.id).toEqual(123);
    expect(instance.user.firstName).toStrictEqual('Alex');
  });
});
