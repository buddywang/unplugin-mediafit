# unplugin-mediafit

- 通过 fitkit 自定义转换函数(自定义转换逻辑、将最终结果保存到 outputFilepath 中)
- 转换函数可以串行组合应用
- 对于每个转换函数，提供 ctx 对象，包含 sharp/ffmpeg（命令行执行工具）
- 规定需要转换格式时，用 f 缩写

视频（ffmpeg）、图片改变尺寸/格式（只改尺寸/格式）

只需下载最大尺寸的资源，通过插件自动重设尺寸并生成新文件，开发/生产环境自动更改路径

- https://sharp.pixelplumbing.com/ resize image
- ffmpeg resize video（ • Node-API v9 compatible runtime e.g. Node.js ^18.17.0 or >=20.3.0.
  ）
- 新文件名=原文件名+参数（按字母顺序）
- 提供预览页面、实时压缩，调整参数（大小差异、效果差异）

## 问题

- 基于压缩后的图片重置尺寸后的图片，应该不用压缩了（用隐写术标记）

# 功能

通过添加 query, 自动对图片/视频进行处理并按 query 生成新的文件

- 对于图片
  - resize
  - 格式转换
- 对于视频
  - resize
  - 去音频

## 图片

参数缩写哲学：取每个单词的第一个字母，例如 quality-> q ; tileWidth-> tw; xres-> xr ; bitdepth-> bd

- 转换尺寸 resize(opt)

  ```js
  {
    w:'width',
    h:'height',
    f:'fit', //cover/contain/fill/inside/outside
    p:'position',
    b:'background',
    k:'kernel',
    we:'withoutEnlargement',
    wr:'withoutReduction',
    fsol:'fastShrinkOnLoad',
  }
  ```

- 转换格式

  - JPEG

  ```js
  {
    q: 'quality',
    p: 'progressive',
    cs:'chromaSubsampling',
    oc: 'optimiseCoding',
    mj: 'mozjpeg',
    tq: 'trellisQuantisation',
    od: 'overshootDeringing',
    os: 'optimiseScans',
    qt: 'quantisationTable',
    f: 'force'
  }
  ```

  - PNG

  ```js
  {
    p: 'progressive',
    cl: 'compressionLevel',
    af:'adaptiveFiltering',
    pa:'palette',
    q:'quality',
    e:'effort',
    c:'colours',
    d:'dither',
    f: 'force'
  }
  ```

  - WebP

  ```js
  {
    q:'quality',
    aa:'alphaQuality',
    ll:'lossless',
    nl:'nearLossless',
    ss:'smartSubsample',
    p:'preset',
    e:'effort',
    l:'loop',
    d:'delay',
    ms:'minSize',
    m:'mixed',
    f:'force',
  }
  ```

  - GIF

  ```js
  {
    r:'reuse',
    p:'progressive',
    c:'colours',
    e:'effort',
    di:'dither',
    ifme:'interFrameMaxError',
    ipme:'interPaletteMaxError',
    l:'loop',
    d:'delay',
    f:'force',
  }
  ```

  - AVIF

  ```js
  {
    q:'quality',
    l:'lossless',
    e:'effort',
    cs:'chromaSubsampling',
    b:'bitdepth',
  }
  ```

  - TIFF

  ```js
  {
    q:'quality',
    f:'force',
    c:'compression',
    p:'predictor',
    py:'pyramid',
    t:'tile',
    tw:'tileWidth',
    th:'tileHeight',
    xr:'xres',
    yr:'yres',
    ru:'resolutionUnit',
    bd:'bitdepth',
    mw:'miniswhite',
  }
  ```

## 视频

1. 用 ffmpeg.wasm 0.12 之前的版本支持 nodejs，免安装(要求 node 版本 16.x)
2. 自己先安装 ffmpeg，确保 ffmpeg 命令全局可以，这时用 child_process 执行命令(要求先安装 ffmpeg)
3. 自定义编译 ffmpeg，根据功能最小化编译，推荐：https://tongyi.aliyun.com/qianwen/share?shareId=e1f87c97-3aea-4d6e-81df-70b69ed8ed25
   https://tongyi.aliyun.com/qianwen/share?shareId=07f0dc14-22a8-4124-bed7-8d7d51ed9533

- mac 上 ffmpeg 编译配置

```bash
./configure \
  --disable-everything \
  --enable-small \
  --enable-gpl \
  --enable-nonfree \
  --enable-libx264 \
  --enable-encoder=libx264 \
  --enable-decoder=h264 \
  --enable-parser=h264 \
  --enable-protocol=file \
  --enable-filter=scale \
  --enable-demuxer=mov,mp4 \
  --enable-muxer=mp4 \
  --enable-static
```

- ffmpeg 编译并安装到当前 install 目录下

```bash
make clean && make -j$(sysctl -n hw.ncpu) && make install DESTDIR=$(pwd)/install
```

> ffmpeg 默认会按`-preset medium` 重新编码，可以通过`-preset xxx` 进行显式控制

- 只进行分辨率调整
  `ffmpeg -i xx.mp4 -vf scale=xx:-1 xx.mp4`

```js
{
  rs: '-vf scale=',
}
```

- 去音频
  `ffmpeg -i xx.mp4 -an xx.mp4`

- todo (提 pr)
  ```js
  {
    :'',
    :'',
    :'',
    :'',
  }
  ```

## 图片提供预览效果页（大小差异、效果对比）
