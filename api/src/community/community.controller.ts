import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommunityService } from './community.service';

@Controller('community')
@ApiTags('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) { console.log(this.communityService);}

}
