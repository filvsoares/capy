import { CodegenWriter } from '@/modules/codegen/codegen-writer';
import { declareExtraKey } from '@/util/extra';

export class CgLibraryData {
  libJsNames: { [libName: string]: string } = {};
  loadLibraryWriter?: CodegenWriter;
}

export const cgLibraryData = declareExtraKey<CgLibraryData>('cgLibraryData');
