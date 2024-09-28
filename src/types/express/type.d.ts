import { BaseEntity } from 'src/common/base.entity';
import { Resource } from 'src/common/resource';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageDto } from '../../common/dto/page.dto';
import { AuthEntityTypeEnum } from '../enums';

declare global {
  namespace Express {
    export interface Response {
      /**
       * Sends data as JSON API response.
       * @param statusCode status code of the response.
       * @param data data to convert to resources.
       */
      sendJsonApiResource(
        statusCode: number,
        data: Resource | Resource[] | BaseEntity | BaseEntity[] | PageDto<T>,
        count?: number,
        meta?: PageMetaDto,
      ): any;

      /**
       * Sends error as JSON API response.
       * @param statusCode status code of the response.
       * @param data data to convert to resources.
       */
      sendJsonApiError(
        statusCode: number,
        title?: string,
        description?: string,
      ): void;

      resourceMapper?: {
        fromEntity: (datum: Resource) => Resource;
      };
    }
    /**
     * Extending the @types/passport definition to be more complete with our use-case.
     * Currently we are storing id and email in JWT token
     */
    interface User {
      id: number;
      employeeId?: number;
      username: string;
    }
    export interface Request {
      user?: User;
      authEntity?: AuthEntityTypeEnum;
    }
  }
}
