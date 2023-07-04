interface BaseNode {
  node: String;
}

export interface CompilationUnit extends BaseNode {
  imports: Array<any>;
  node: "CompilationUnit";
  package: any;
  types: Array<TypeDeclaration>;
}

export interface TypeDeclaration {
  node: "TypeDeclaration";
  bodyDeclarations: Array<BaseNode>;
  comments: Array<BaseNode>;
  interface: boolean;
  modifiers: Array<BaseNode>;
  name: Name;
  SuperInterfaceTypes: Array<BaseNode>;
  SuperClassType: Type;
  TypeParameters: Array<TypeParameter>;
}

interface Name extends BaseNode {
  //todo
}

export interface SimpleName extends Name {
  node: "SimpleName";
}

interface Type extends BaseNode {
  //todo
}

export interface SimpleType extends Type {
  node: "SimpleType";
}

export interface TypeParameter extends BaseNode {
    node: "TypeParameter"
}