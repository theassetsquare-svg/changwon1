/**
 * 본문 대표 이미지.
 *
 * og:image·thumbnail 메타가 가리키는 파일을 본문에도 그대로 넣는다. 네이버는 메타만
 * 보고 썸네일을 잡지 않고 본문에 실제로 실린 이미지를 같이 본다. 그래서 두 곳이
 * 반드시 같은 파일이어야 한다. 다른 파일을 넣으면 어느 쪽도 확실해지지 않는다.
 *
 * next/image 는 정적 export 에서 최적화 없이 그대로 나가므로 굳이 쓰지 않는다.
 * width·height 를 미리 박아 레이아웃 흔들림(CLS)을 없앤다.
 */
export default function PageThumb({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={1200}
      height={1200}
      style={{ maxWidth: "100%", height: "auto" }}
      loading="eager"
    />
  );
}
