// nodes/ImageNode.tsx
import type { JSX } from "react";
import {
  DecoratorNode,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from "lexical";

export interface ImagePayload {
  src: string;
  altText: string;
  width?: number | "inherit";
  height?: number | "inherit";
  key?: NodeKey;
}

export type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    width: number;
    height: number;
    type: "image";
    version: 1;
  },
  SerializedLexicalNode
>;

function ImageComponent({
  src,
  altText,
  width,
  height,
}: {
  src: string;
  altText: string;
  width: number | "inherit";
  height: number | "inherit";
}): JSX.Element {
  return (
    <img
      src={src}
      alt={altText}
      style={{
        maxWidth: "100%",
        height: height === "inherit" ? "auto" : height,
      }}
      draggable={false}
    />
  );
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: number | "inherit";
  __height: number | "inherit";

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, src, width } = serializedNode;
    return $createImageNode({
      src,
      altText,
      width: width || "inherit",
      height: height || "inherit",
    });
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.__altText,
      height: this.__height === "inherit" ? 0 : this.__height,
      src: this.__src,
      type: "image",
      version: 1,
      width: this.__width === "inherit" ? 0 : this.__width,
    };
  }

  constructor(
    src: string,
    altText: string,
    width: number | "inherit" = "inherit",
    height: number | "inherit" = "inherit",
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
      />
    );
  }
}

export function $createImageNode({
  src,
  altText,
  width,
  height,
  key,
}: ImagePayload): ImageNode {
  return new ImageNode(src, altText, width, height, key);
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}
