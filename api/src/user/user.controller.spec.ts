import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const userList = [
  {
    'id': '1',
    'first_name': 'Marcus',
    'usual_full_name': 'Marcus Vinicius',
    'email': 'mavinici@student.42sp.org.br',
    'nick': 'mavinici',
    'imgUrl': 'https://cdn.intra.42.fr/users/mavinici.jpeg',
    'token': 'af23d81b88e96fc7e1a2cc1e0238ff58fd9f4',
    'createdAt': '2022-10-05T23:07:45.557Z',
    'updatedAt': '2022-10-05T23:08:46.813Z'
  },
  {
    'id': '2',
    'first_name': 'Marcus2',
    'usual_full_name': 'Marcus2 Vinicius',
    'email': 'mavinici2@student.42sp.org.br',
    'nick': 'mavinici2',
    'imgUrl': 'https://cdn.intra.42.fr/users/mavinici.jpeg',
    'token': 'af23d81b88e96fc7e1a2cc1e0238ff58fd9f4',
    'createdAt': '2022-10-05T23:07:45.557Z',
    'updatedAt': '2022-10-05T23:08:46.813Z'
  },
];

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            getUsers: jest.fn().mockResolvedValue(userList)
          }
        }
      ]
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should  be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      //act
      const result = await userController.getUsers();

      //Assert
      expect(result).toEqual(userList);
      expect(userService.getUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('should return success message', async () => {
      //Arrange
      const createUserDto = {
        'first_name': 'Marcus',
        'usual_full_name': 'Marcus Vinicius',
        'email': 'mavinici@student.42sp.org.br',
        'nick': 'mavinici',
        'imgUrl': 'https://cdn.intra.42.fr/users/mavinici.jpeg',
        'token': 'af23d81b88e96fc7e1a2cc1e0238ff58fd9f4',
      };

      //Act
      const result = await userController.createUser(createUserDto);

      //Assert
      expect(result).toEqual({ msg: 'success' });
    });
  });
});