# Threejs

## 1 入门示例

Three.js项目整体开发流程可以按照一下步骤进行。

- 容器构建：添加需要渲染3D内容的容器和基本页面结构。
- 引入资源：导入Three.js、以及开发页面功能所需要的其他库、静态资源等。
- 场景初始化：定义一些全局变量，如渲染尺寸、容器等；初始化渲染器；初始化场景；处理页面缩放事件监听处理等。
- 逻辑开发：按需求开发业务功能，并将其添加到场景中。
- 动画更新：更新渲染器和相机，并根据业务需求，更新其他网格模型动画。
- 性能优化：离开页面时释放GPU资源、清除定时器和动画等。
- 修饰优化：使用css、图片等元素装饰界面，提升页面视觉效果。

### 1.1 容器构建

添加一个canvas元素。

<!DOCTYPE html>
<html lang="zh-cn">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>three</title>
  </head>
  <body>
    <canvas class="webgl"></canvas>
  </body>
</html>

### 1.2 引入资源

在顶部引 `样式表` 和 `Three.js`，`Three.js`可以像示例中一样全量引入，也可以这样 `import { Scene } from 'three'` 这样按需引入以减少文件体积，提高加载速率。

```javascript
import './style.css';
import * as THREE from 'three';
```



### 1.3 场景初始化

```javascript
// 定义渲染尺寸
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// 初始化渲染器
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 初始化场景
const scene = new THREE.Scene();

// 初始化相机
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera);
```

#### `知识点 💡`  **渲染器 WebGLRenderer**

WebGLRenderer用WebGL渲染出场景。通过`new THREE.WebGLRenderer`初始化渲染器，并将canvas容器作为参数传给它。

通过`setSize`方法设置渲染器的尺寸；

通过`setPixelRatio`设置canvas的像素比为当前设备的屏幕像素比，避免高分屏下出现模糊情况。

#### `知识点 💡`  **场景 Scene**

Scene是场景对象，所有的网格对象，灯光、动画都需要放在场景中，使用`new THREE.Scene`初始化场景，下面是场景的一些常用属性和方法。

- fog：设置场景的物化效果，可以渲染出一层雾气，隐层远处的物体。
- overrideMaterial：强制场景中所有物体使用相同材质。
- autoUpdate：设置是否自动更新。
- children：所有对象的列表。
- add()：向场景中添加对象。
- remove()：从场景中移除对象。
- getChildByName()：根据名字直接返回这个对象。
- traverse()：传出一个回调函数访问所有的对象。



#### `知识点 💡` **透视相机 PerspectiveCamera**

为了在场景中显示物体，就必须给场景添加相机，相机类型可以分为正交相机和透视相机，本例子使用透视相机`PerspectiveCamera`。

正交相机：没有近大远小。

透视相机：近大远小，接近人眼。

```javascript
构造函数
PerspectiveCamera(fov, aspect, near, far)
```

- `fov`：表示视场，就是能够看到的角度范围，人的眼睛大约能够看到 `180度` 的视场，视角大小设置要根据具体应用，一般游戏会设置 `60~90` 度，默认值 `45`。

- `aspect`：表示渲染窗口的长宽比，如果一个网页上只有一个全屏的 `canvas` 画布且画布上只有一个窗口，那么 `aspect` 的值就是网页窗口客户区的宽高比 `window.innerWidth/window.innerHeight`。

- `near`：属性表示的是从距离相机多远的位置开始渲染，一般情况会设置一个很小的值。 默认值 `0.1`。

- `far`：属性表示的是距离相机多远的位置截止渲染，如果设置的值偏小，会有部分场景看不到，默认值 `1000`。

### 1.4 页面缩放适配

```javascript
// 页面缩放事件监听
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // 更新渲染
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 更新相机
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});
```

### 1.5 逻辑开发

要创建客家在显示在场景中的内置三维模型，需要添加网格**Mesh**，并为它创建几何体`Geometery`和材质`Material`。

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x03c03c });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

#### `知识点 💡` **立方体BoxGeometry**

BoxGeometry是四边形的原始几何类，来创建立方体或者不规则四边形。

```
BoxGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)
```

- width — X 轴上面的宽度，默认值为 `1`。
- height — Y 轴上面的高度，默认值为 `1`。
- depth — Z 轴上面的深度，默认值为 `1`。
- widthSegments — （可选）宽度的分段数，默认值是 `1`。
- heightSegments — （可选）高度的分段数，默认值是 `1`。
- depthSegments — （可选）深度的分段数，默认值是 `1`。

#### `知识点 💡` **基础网格材质 MeshBasicMaterial**

基础网格材质是一种一个以简单着色方式来绘制几何体的材质，它不受光照的影响。

```
MeshBasicMaterial( parameters : Object )
```

- parameters：可选，用于定义材质外观的对象，具有一个或多个属性，如color、map等。

https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial

### 1.6 动画更新

```javascript
// 动画
const tick = () => {
  // 更新渲染器
  renderer.render(scene, camera);
  // 给网格模型添加一个转动动画
  mesh && (mesh.rotation.y += .02);
  mesh && (mesh.rotation.x += .02);
  // 页面重绘时调用自身
  window.requestAnimationFrame(tick);
}
tick();
```

## 2 星球案例

### 2.1 资源引入

```javascript
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
```



### 2.2 渲染场景初始化

值得注意的是，本文中通过 `scene.background` 给场景设置了一个深黑色背景，通过 `scene.fog` 给场景设置了雾化效果，**场景缩小到一定程度时页面就会叠加一种雾气一样的效果，场景中的物体会逐渐变得模糊**。

```javascript
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// 容器构建
const canvas = document.querySelector(".webgl");
// 初始化渲染器
const render = new THREE.WebGLRenderer({ canvas: canvas });
render.setSize(sizes.width, sizes.height);
render.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 初始化场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);
scene.fog = new THREE.Fog(0x1a1a1a, 1, 1000);

// 初始化相机
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height);
camera.position.set(20, 100, 450);
scene.add(camera);
```

#### `💡 知识点`  **Scene.Fog 场景雾化**

Fog类定义的是线性雾，雾的密度随着距离线性增大，即场景中物体雾化效果随着距离线性变化。

```
Fog(color, near, far);
```

- `color`: 表示雾的颜色，如设置为白色，场景中远处物体为蓝色，场景中最近处距离物体是自身颜色，最远和最近之间的物体颜色是物体本身颜色和雾颜色的混合效果。
- `near`：表示应用雾化效果的最小距离，距离活动摄像机长度小于 `near` 的物体将不会被雾所影响。
- `far`：表示应用雾化效果的最大距离，距离活动摄像机长度大于 `far` 的物体将不会被雾所影响。

### 2.3 初始化控制器

轨道控制器`OrbitControls`,通过它可以对三维场景用鼠标进行缩放、平移、旋转等操作，本质上改变的不是场景，而是相机的位置参数。可以选择通过设置controls.enableDamping 为true来开启控制器的移动惯性，这样在鼠标交互过程中就会感觉更加流畅和逼真。

```javascript
// 初始化控制器
const controls = new OrbitControls(camera, render.domElement);
controls.enableDamping = true;
```

### 2.4 添加光源

和现实世界一样，没有光线的话就什么都看不见，未添加光源之前场景中的所有网格元素都是黑色的，无法显示其颜色和材质表面的物理特性，此时就需要给场景添加光源，才能看见场景中的物体。



`AmbientLight` 环境光，它是一种基础光源，整个场景中的物体都将接收它的颜色。其中两个参数分别代表光照的颜色和强度。

```javascript
const light = new THREE.AmbientLight(0xdeedff, 1.5);
scene.add(light);
```

#### `💡 知识点` **光源 Light**

`Three.js` 中提供了很多种光源，它们可以模拟现实世界中大部分场景的光照效果。光源的使用方法也大致和本文示例中是一样的。下表列出了几种常用的光源，可以根据自己的需求场景分别选择不同的光源。大家可以在实践中把本示例中的环境光 `AmbientLight` 换成其他效果光源，看看它们生成的有什么区别。

| 光源名称          | 描述                                                         |
| ----------------- | ------------------------------------------------------------ |
| `AmbientLight`    | 环境光，是一种基础光源，它的颜色会添加到整个场景和所有对象的当前颜色上 |
| `PointLight`      | 点光源，空间中的一点，朝所有的方向发射光线                   |
| `SpotLight`       | 聚光灯光源，这种光源有聚光的效果，类似台灯、天花板上的吊灯，或者手电筒 |
| `DirectionLight`  | 方向光，也称为无限光。从这种光源发出的光线可以看着平行的。例如，太阳光 |
| `HemishpereLight` | 半球光，这是一种特殊光源，可以用来创建更加自然的室外光线，模拟放光面和光线微弱的天空 |
| `AreaLight`       | 面光源，使用这种光源可以指定散发光线的平面，而不是空间中的一个点 |
| `LensFlare`       | 镜头眩光，不是源，但可以通过 `LensFlare` 为场景中的光源添加镜头光晕效果 |

光源的一些通用属性：

- `color`：光源颜色。
- `intensity`：光照强度。默认值是 `1`。
- `visible`：如果设为 `true`，该光源就会显示；如果设置为`false`，光源就会消失。

### 2.5 创建星球

先创建立方体和材质，再用它们生成网格模型，最后将它添加到场景中即可。星球模型使用了非光泽表面材质 `MeshLambertMaterial`，立方体采用 `SphereGeometry` 生成。为材质设置 `wireframe: true` 属性就能得到几何模型的线框结构

```js
const SphereMaterial = new THREE.MeshLambertMaterial({
  color: 0x03c03c,
  wireframe: true,
});
const SphereGeometry = new THREE.SphereGeometry(80, 32, 32);
const planet = new THREE.Mesh(SphereGeometry, SphereMaterial);
scene.add(planet);

```



#### `💡 知识点` 几何体 Geometry

下面汇总了 `Three.js` 常用几何体的分类介绍以及构造器的参数，后续使用过程中可通过此表查询。由于本文篇幅内容有限，就不一一展示具体形状，大家在学习过程中一定要亲自动手试试各种几何体创建后是什么样子的，也可以多看看 `threejs.org` 官网文档。

https://threejs.org/docs/index.html#api/zh/materials/LineBasicMaterial

| 名称                                                         | 构造方法                                                     | 构造器参数                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `PlaneGeometry`（平面几何）                                  | PlaneGeometry(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer) | 【平面几何体】 `width` — 平面沿着X轴的宽度。默认值是 `1`。`height` — 平面沿着 `Y轴` 的高度。默认值是 `1`。`widthSegments` — 可选，平面的宽度分段数，默认值是 `1`。 `heightSegments` — 可选，平面的高度分段数，默认值是 `1`。 |
| `CircleGeometry`（由三角形拼接成）                           | CircleGeometry(radius : Float, segments : Integer, thetaStart : Float, thetaLength : Float) | 【圆形几何体】 `radius` — 圆形的半径，默认值为`1`。 `segments` — 分段的数量，最小值为 `3`，默认值为 `8`。`thetaStart` — 第一个分段的起始角度，默认为 `0`。`thetaLength` — 圆形扇区的中心角，通常被称为 `θ`。默认值是 `2*Pi`，这使其成为一个完整的圆。 |
| `RingGeometry`（跟CircleGeometry差不多，不过中间能镂空）     | RingGeometry(innerRadius : Float, outerRadius : Float, thetaSegments : Integer, phiSegments : Integer, thetaStart : Float, thetaLength : Float) | 【环形几何体】  `innerRadius` — 内部半径，默认值为 `0.5`。`outerRadius` — 外部半径，默认值为 `1`。`thetaSegments` — 圆环的分段数。这个值越大，圆环就越圆。最小值为 `3`，默认值为 `8`。`phiSegments` — 最小值为 `1`，默认值为 `8`。`thetaStart` — 起始角度，默认值为 `0`。`thetaLength` — 圆心角，默认值为 `Math.PI * 2`。 |
| `ShapeGeometry`（从一个或多个路径形状中创建一个单面多边形几何体） |                                                              | 【形状几何体】 `shapes` — 一个单独的 `shape`，或者一个包含形状的 `Array`。 `curveSegments` - `Integer` - 每一个形状的分段数，默认值为 `12`。 |
| `BoxGeometry`（立方体）                                      | BoxGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer) | 【立方几何体】 `width` — X轴上面的宽度，默认值为 `1`。 `height` —  `Y` 轴上面的高度，默认值为 `1`。 `depth` — `Z` 轴上面的深度，默认值为 `1`。`widthSegments` — 可选，宽度的分段数，默认值是 `1`。`heightSegments` — 可选，宽度的分段数，默认值是 `1`。`depthSegments` — 可选，宽度的分段数，默认值是 `1`。 |
| `SphereGeometry`（球形）                                     | SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float) | 【球几何体】 `radius` — 球体半径，默认为 `1`。`widthSegments` — 水平分段数，最小值为 `3`，默认值为 `8`。`heightSegments` — 垂直分段数，最小值为 `2`，默认值为 `6`。`phiStart` — 指定水平起始角度，默认值为 `0`。 `phiLength` — 指定水平扫描角度的大小，默认值为 `Math.PI * 2`。`thetaStart` — 指定垂直起始角度，默认值为 `0`。`thetaLength` — 指定垂直扫描角度大小，默认值为 `Math.PI`。 |
| `CylinderGeometry`(圆柱)                                     | CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float) | 【圆柱几何体】 `radiusTop` — 圆柱的顶部半径，默认值是 `1`。`radiusBottom` — 圆柱的底部半径，默认值是 `1`。`height` — 圆柱的高度，默认值是 `1`。`radialSegments` — 圆柱侧面周围的分段数，默认为 `8`。 `heightSegments` — 圆柱侧面沿着其高度的分段数，默认值为 `1`。`openEnded` — 一个 `Boolean` 值，指明该圆锥的底面是开放的还是封顶的。默认值为 `false`，即其底面默认是封顶的。`thetaStart` — 第一个分段的起始角度，默认为 `0`。`thetaLength` — 圆柱底面圆扇区的中心角，通常被称为 `“θ”`。默认值是 `2*Pi`，这使其成为一个完整的圆柱。 |
| `ConeGeometry`（圆锥）                                       | ConeGeometry(radius : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float) | 【圆锥几何体】 `radius` — 圆锥底部的半径，默认值为 `1`。height — 圆锥的高度，默认值为1。 `radialSegments` — 圆锥侧面周围的分段数，默认为 `8`。`heightSegments` — 圆锥侧面沿着其高度的分段数，默认值为 `1`。`openEnded` — 一个Boolean值，指明该圆锥的底面是开放的还是封顶的。默认值为 `false`，即其底面默认是封顶的。·thetaStart· — 第一个分段的起始角度，默认为 `0`。`thetaLength` — 圆锥底面圆扇区的中心角，通常被称为 `“θ”`。默认值是 `2*Pi`，这使其成为一个完整的圆锥。 |
| `TorusGeometry`（圆环，甜甜圈）                              | TorusGeometry(radius : Float, tube : Float, radialSegments : Integer, tubularSegments : Integer, arc : Float) | 【圆环几何体】 `radius` - 圆环的半径，从圆环的中心到管道的中心。默认值是 `1`。`tube` — 管道的半径，默认值为 `0.4`。`radialSegments` — 圆环的分段数，默认值为 `8`。`tubularSegments` — 管道的分段数，默认值为 `6`。`arc` — 圆环的中心角，默认值为 `Math.PI * 2`。 |
| `TextGeometry`                                               | TextGeometry(text : String, parameters : Object)             | 【文本几何体】 `font` — `THREE.Font` 的实例。`size` — `Float`。字体大小，默认值为 `100`。`height` — `Float`。挤出文本的厚度。默认值为 `50`。`curveSegments` — `Integer`。曲线上点的数量。默认值为 `12`。`bevelEnabled` — `Boolean`。是否开启斜角，默认为 `false`。`bevelThickness` — `Float`。文本上斜角的深度，默认值为 `20`。`bevelSize` — `Float`。斜角与原始文本轮廓之间的延伸距离。默认值为 `8`。`bevelSegments` — `Integer`。斜角的分段数。默认值为 `3`。 |
| `TetrahedronGeometry`（默认为 四面体，可以增加顶点数量）     | TetrahedronGeometry(radius : Float, detail : Integer)        | 【四面几何体】 `radius` — 四面体的半径，默认值为 `1`。`detail` — 默认值为 `0`。将这个值设为一个大于 `0` 的数将会为它增加一些顶点，使其不再是一个四面体。 |
| `OctahedronGeometry`（默认为 八面体，可以增加顶点数量）      | OctahedronGeometry(radius : Float, detail : Integer)         | 【八面几何体】 `radius` — 八面体的半径，默认值为 `1`。`detail` — 默认值为 `0`，将这个值设为一个大于 `0` 的数将会为它增加一些顶点，使其不再是一个八面体。 |
| `DodecahedronGeometry`（默认为十二面体，可以增加顶点数量）   | DodecahedronGeometry(radius : Float, detail : Integer)       | 【十二面几何体】 `radius` — 十二面体的半径，默认值为 `1`。`detail` — 默认值为 `0`。将这个值设为一个大于 `0` 的数将会为它增加一些顶点，使其不再是一个十二面体。 |
| `IcosahedronGeometry`（默认为二十面体，可以增加顶点数量）    | IcosahedronGeometry(radius : Float, detail : Integer)        | 【二十面几何体】 `radius` — 二十面体的半径，默认为 `1`。`detail` — 默认值为 `0`。将这个值设为一个大于 `0` 的数将会为它增加一些顶点，使其不再是一个二十面体。当这个值大于 `1` 的时候，实际上它将变成一个球体。 |
| `TorusKnotGeometry`                                          | TorusKnotGeometry(radius : Float, tube : Float, tubularSegments : Integer, radialSegments : Integer, p : Integer, q : Integer) | 【圆环扭结几何体】 `radius` - 圆环的半径，默认值为 `1`。`tube` — 管道的半径，默认值为 `0.4`。`tubularSegments` — 管道的分段数量，默认值为 `64`。`radialSegments` — 横截面分段数量，默认值为 `8`。`p` — 这个值决定了几何体将绕着其旋转对称轴旋转多少次，默认值是 `2`。`q` — 这个值决定了几何体将绕着其内部圆环旋转多少次，默认值是 `3`。 |
| `PolyhedronGeometry`                                         | PolyhedronGeometry(vertices : Array, indices : Array, radius : Float, detail : Integer) | 【多面几何体】 `vertices` — 一个顶点 `Array`：`[1,1,1, -1,-1,-1, … ]`。`indices` — 一个构成面的索引 `Array`， `[0,1,2, 2,3,0, … ]`。`radius` — `Float` - 最终形状的半径。`detail` — `Integer` - 将对这个几何体细分多少个级别。细节越多，形状就越平滑。 |
| `TubeGeometry`                                               | TubeGeometry(path : [Curve](https://threejs.org/docs/index.html#api/zh/extras/core/Curve), tubularSegments : Integer, radius : Float, radialSegments : Integer, closed : Boolean) | 【管道几何体】 `path` — `Curve` - 一个由基类 `Curve` 继承而来的路径。`tubularSegments` — `Integer` - 组成这一管道的分段数，默认值为 `64`。`radius` — `Float` - 管道的半径，默认值为 `1`。`radialSegments` — `Integer` - 管道横截面的分段数目，默认值为 `8`。`closed` — `Boolean` 管道的两端是否闭合，默认值为 `false`。 |

#### `💡 知识点` 材质 Material

材质可以模拟现实世界中物体表面的物理特性，`Three.js` 也提供的丰富的材质，我们在创建不同物体时可以选择不同的材质，比如创建木制桌面时可以选择 `MeshPhysicalMaterial 物理网格材质`，创建卡通风格模型时可以选择 `MeshToonMaterial 卡通网格材质`。下表列出了几种常用的材质类型及其说明。

| 名称                   | 描述                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `MeshBasicMaterial`    | 基础网格基础材质，用于给几何体赋予一种简单的颜色，或者显示几何体的线框。 |
| `MeshDepthMaterial`    | 网格深度材质，这个材质使用从摄像机到网格的距离来决定如何给网格上色。 |
| `MeshStandardMaterial` | 标准网格材质，一种基于物理的标准材质，使用 `Metallic-Roughness` 工作流程 |
| `MeshPhysicalMaterial` | 物理网格材质，`MeshStandardMaterial` 的扩展，能够更好地控制反射率。 |
| `MeshNormalMaterial`   | 网格法向材质，这是一种简单的材质，根据法向向量计算物体表面的颜色。 |
| `MeshLambertMaterial`  | 网格 `Lambert` 材质，这是一种考虑光照影响的材质，用于创建暗淡的、不光亮的物体。 |
| `MeshPhongMaterial`    | 网格 `Phong` 式材质，这是一种考虑光照影响的材质，用于创建光亮的物体。 |
| `MeshToonMaterial`     | 网格 `Phong` 式材质，`MeshPhongMaterial` 卡通着色的扩展。    |
| `ShaderMaterial`       | 着色器材质，这种材质允许使用自定义的着色器程序，直接控制顶点的放置方式以及像素的着色方式。 |
| `LineBasicMaterial`    | 直线基础材质，这种材质可以用于 `THREE.Line` 直线几何体，用来创建着色的直线。 |



### 2.6 创建星球轨道环

使用上述同样的方法，选择 `圆环几何体 TorusGeometry` 添加星球轨道到场景中，通过调整它的 `rotation` 属性来设置倾斜角度。

```javascript
// 创建星球轨道环
const torusGeometry = new THREE.TorusGeometry(100, 8, 2, 120);
const tourMaterial = new THREE.MeshLambertMaterial({
  color: 0x40a9ff,
  wireframe: true,
});
const ring = new THREE.Mesh(torusGeometry, tourMaterial);
ring.rotation.x = Math.PI / 2;
ring.rotation.y = -0.1 * (Math.PI / 2);
scene.add(ring);
```



### 2.7 创建星星

```js
const stars = new THREE.Group();
for (let i = 0; i < 500; i++) {
  const geometry = new THREE.IcosahedronGeometry(Math.random() * 2, 0);
  const material = new THREE.MeshToonMaterial({ color: 0xeeeeee });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 700;
  mesh.position.y = (Math.random() - 0.5) * 700;
  mesh.position.z = (Math.random() - 0.5) * 700;
  mesh.rotation.x = Math.random() * 2 * Math.PI;
  mesh.rotation.y = Math.random() * 2 * Math.PI;
  mesh.rotation.z = Math.random() * 2 * Math.PI;
  stars.add(mesh);
}
scene.add(stars);

```



### 2.8 动画更新

```javascript
let rot = 0;
const axis = new THREE.Vector3(0, 0, 1);
const tick = () => {
  render.render(scene, camera);
  // 星球自转
  planet && (planet.rotation.y += 0.005);

  // 轨道
  ring && ring.rotateOnAxis(axis, Math.PI / 400);

  // 卫星位置动画
  rot += Math.random() * 0.8;
  const radian = (rot * Math.PI) / 180;
  satellite.position.x = 250 * Math.sin(radian);
  satellite.position.y = 100 * Math.cos(radian);
  satellite.position.z = -100 * Math.cos(radian);
  satellite.rotation.x += 0.005;
  satellite.rotation.y += 0.005;
  satellite.rotation.z -= 0.005;

  stars.rotation.x += 0.0009;
  stars.rotation.y += 0.0003;
  // 更新自身控制器
  controls.update();
  window.requestAnimationFrame(tick);
};
```

## 3 模型光源结合明暗变化案例

### 3.1 资源引入

```javascript
import "./style.css";
import {
  Clock,
  Scene,
  LoadingManager,
  WebGLRenderer,
  sRGBEncoding,
  Group,
  PerspectiveCamera,
  DirectionalLight,
  PointLight,
  MeshPhongMaterial,
} from "three";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

```

### 3.2 场景初始化

```javascript
const section = document.querySelectorAll(".section")[0];
let oldMaterial;
let width = section.clientWidth;
let height = section.clientHeight;

// 初始化渲染器
const renderer = new WebGLRenderer({
  canvas: document.getElementById("canvas-container"),
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.autoClear = true;
renderer.outputEncoding = sRGBEncoding;

const renderer2 = new WebGLRenderer({
  canvas: document.querySelector("#canvas-container-details"),
  antialias: false,
});
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer2.setSize(width, height);
renderer2.outputEncoding = sRGBEncoding;

// 初始化场景
const scene = new Scene();

// 初始化相机
const cameraGroup = new Group();
scene.add(cameraGroup);
const camera = new PerspectiveCamera(35, width / height, 1, 100);
camera.position.set(19, 1.54, -0.1);
cameraGroup.add(camera);

// 相机2
const camera2 = new PerspectiveCamera(
  35,
  section.clientWidth / section.clientHeight,
  1,
  100
);
camera2.position.set(3.2, 2.8, 3.2);
camera2.rotation.set(0, 1, 0);
scene.add(camera2);

// 页面缩放事件监听
window.addEventListener("resize", () => {
  let section = document.getElementsByClassName("section")[0];
  camera.aspect = section.clientWidth / section.clientHeight;
  camera.updateProjectionMatrix();
  camera2.aspect = section.clientWidth / section.clientHeight;
  camera2.updateProjectionMatrix();
  renderer.setSize(section.clientWidth, section.clientHeight);
  renderer2.setSize(section.clientWidth, section.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
```

#### `💡 知识点` 渲染编码outputEncoding

`outputEncoding` 属性控制输出渲染编码。

- 默认情况下，值为 `THREE.LinearEncoding`，这种线性编码的缺点是看起来不够真实。
- 此时可以将值设置为 `THREE.sRGBEncoding` 提升渲染输出效果的真实性。
- 此外还有另一个可选属性值为 `THREE.GammaEncoding`，它是一种存储颜色的方法, 这种编码的优点在于它允使用一种表现像亮度的 `gammaFactor` 值，根据人眼的敏感度优化明暗值的存储方式。当使用 `sRGBEncoding` 时，其实就像使用默认 `gammaFactor` 值为 `2.2` 的 `GammaEncoding`。

### 3.3 加载管理

模型在加载的时候有段空白时间，此时可以添加一个Loading页面展示资源加载进度来缓解等待时间。

https://threejs.org/docs/index.html#api/zh/loaders/managers/LoadingManager

#### `💡知识点` 加载管理器 LoadingManager

处理并跟踪已加载和待处理的数据。能够把握加载的进度。

```javascript
const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log("加载开始");
};

// 所有项目加载完成后调用
manager.onLoad = function () {
  console.log("加载完成");
};

// 加载完成时调用
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
  console.log("加载结束");
};

manager.onError = function (url) {
  console.log("加载出错..." + url);
};

const loader = new THREE.OBJLoader(manager);
loader.load("file.obj", function (object) {});
```

#### `💡知识点` 补间动画 TWEEN.JS

https://github.com/tweenjs/tween.js/blob/main/README_zh-CN.md

#### `💡知识点` 加载器DRACOLoader

一个用于加载经过Draco压缩的图形库。

```javascript
// 使用 dracoLoader 加载用blender压缩过的模型
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
dracoLoader.setDecoderConfig({ type: "js" });
const loader = new GLTFLoader(loadingManager);
loader.setDRACOLoader(dracoLoader);

// 模型加载
loader.load("/models/statue.glb", function (gltf) {
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      oldMaterial = obj.material;
      obj.material = new MeshPhongMaterial({ shininess: 100 });
    }
  });
  scene.add(gltf.scene);
  oldMaterial.dispose();
  renderer.renderLists.dispose();
});
```

### 3.4 添加光源

模型加载完成之后，为了模型可以显示在场景中，就需要添加光源 `💡` 。本示例中添加了两种初始光源：白色 `⬜` 的**直射光**和偏绿色 `🟩` 的**点光源**。其中直射光作为照亮场景的基础光源；点光源用来实现鼠标略过模型时明暗变化效果。点光源是一种单点发光，照射所有方向的光源，它的发光效果类似于夜空中发射的照明弹，在点光源的照射下，物体的迎光面会亮一些，背光面会暗一些。

```javascript
// 直射光
const directionLight = new DirectionalLight(0xffffff, 0.8);
directionLight.position.set(-100, 0, -100);
scene.add(directionLight);

// 点光源
const fillLight = new PointLight(0x88ffee, 2.7, 4, 3);
fillLight.position.set(30, 3, 1.8);
scene.add(fillLight);
```

### 3.5 动画效果

#### 虚拟光标

```javascript
// 鼠标移动时添加虚拟光标
const cursor = { x: 0, y: 0 };
const cursorDom = document.querySelector(".cursor");
document.addEventListener(
  "mousemove",
  (event) => {
    event.preventDefault();
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;
    cursorDom.style.cssText = `left: ${event.clientX}px; top: ${event.clientY}px;`;
  },
  false
);
```

#### 点光源随鼠标移动

```javascript
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  const parallaxY = cursor.y;
  const parallaxX = cursor.x;
  fillLight.position.y -=
    (parallaxY * 9 + fillLight.position.y - 2) * deltaTime;
  fillLight.position.x +=
    (parallaxX * 8 - fillLight.position.x) * 2 * deltaTime;
  cameraGroup.position.z -=
    (parallaxY / 3 + cameraGroup.position.z) * 2 * deltaTime;
  cameraGroup.position.x +=
    (parallaxX / 3 - cameraGroup.position.x) * 2 * deltaTime;
  TWEEN.update();
  secondContainer
    ? renderer2.render(scene, camera2)
    : renderer.render(scene, camera);

  requestAnimationFrame(tick);
};
tick();
```

#### `💡 知识点` Clock

本文中使用 `Clock` 提供的 `getElapsedTime` 方法来获取页面重绘两帧之间的时间间隔。 `Clock` 本质上就是对 `Date` 进行封装，提供了一些方法和属性，在 `Three.js` 使用过程中涉及到时间相关的方法时不用对 `Date` 进行封装，直接使用 `Clock` 提供的方法即可。在骨骼动画、变形动画、粒子动画等功能的开发中常常需要调用 `Clock` 的方法。

**两个常用方法**：

- `getElapsedTime()`：获取自时钟启动后的秒数，同时将 `.oldTime` 设置为当前时间。 如果 `.autoStart` 设置为 `true` 且时钟并未运行，则该方法同时启动时钟。
- `getDelta()`：获取自 `.oldTime` 设置后到当前的秒数。 同时将 `.oldTime` 设置为当前时间。 如果 `.autoStart` 设置为 `true` 且时钟并未运行，则该方法同时启动时钟。



#### `💡 知识点` Intersection Observer

本文中使用 `Intersection Observer` 来辨识当前处于哪个页面以更新相机位置。

`IntersectionObserver` 接口提供了一种异步观察目标元素与其祖先元素或顶级文档视窗 `viewport` 交叉状态的方法。

可以使用它来检测元素在页面上的可视状态或者两个元素之间的相对可视状态。应用这一特性可以用它来实现页面滚动加载、图片懒加载等功能。

```javascript
let secondContainer = false;
const intersectionObserver = new IntersectionObserver(
  (entries) => {
    secondContainer = entries[0].intersectionRatio > 0.05;
  },
  { threshold: 0.05 }
);

intersectionObserver.observe(document.querySelector(".second"));
```

## 4 粒子

### 4.1 资源引入

```javascript
import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
```

### 4.2 场景初始化

```javascript
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// 初始化渲染器
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGL1Renderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 初始化场景
const scene = new THREE.Scene();

// 初始化相机
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 120;
scene.add(camera);

// 镜头控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 页面缩放事件监听
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // 更新渲染
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // 更新相机
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

// 创建粒子
const createSprite = () => {
  for (let i = -15; i < 15; i++) {
    for (let j = -15; j < 15; j++) {
      let material = new THREE.SpriteMaterial({
        color: Math.random() * 0xffffff,
      });
      let sprite = new THREE.Sprite(material);
      sprite.position.set(i * 4, j * 4, 0);
      scene.add(sprite);
    }
  }
};
createSprite();


```

#### `知识点 💡` 精灵材质 THREE.SpriteMaterial

`THREE.SpriteMatrial` 对象的一些可修改属性及其说明。

- `color`：粒子的颜色。
- `map`：粒子所用的纹理，可以是一组 `sprite sheet`。
- `sizeAttenuation`：如果该属性设置为 `false`，那么距离摄像机的远近不影响粒子的大小，默认值为 `true`。
- `opacity`：该属性设置粒子的不透明度。默认值为 `1`，不透明。
- `blending`：该属性指定渲染粒子时所用的融合模式。
- `fog`：该属性决定粒子是否受场景中雾化效果影响。默认值为 `true`。

### 使用THREE.Sprite创建粒子

`Three.js` 提供多种方法创建粒子，首先我们使用 `THREE.Sprite` 来通过如下的方式创建一个 `20 x 30` 的粒子系统。通过 `new THREE.Sprite()` 构造方法来创建粒子，给它传入唯一的参数**材质**，此时可选的材质类型只能是 `THREE.SpriteMaterial` 或 `THREE.SpriteCanvasMaterial`。创建材质时将它的 `color` 属性值设置成了随机色。由于`THREE.Sprite` 对象继承于 `THREE.Object3D`，它的大多数属性和方法都可以直接使用。示例中使用了 `position` 方法对粒子进行定位设置。还可以使用 `scale` 属性进行缩放、使用 `translate` 属性进行位移设置等。

```
const createSprite = () => {
  for (let i = -15; i < 15; i++) {
    for (let j = -15; j < 15; j++) {
      let material = new THREE.SpriteMaterial({
        color: Math.random() * 0xffffff,
      });
      let sprite = new THREE.Sprite(material);
      sprite.position.set(i * 4, j * 4, 0);
      scene.add(sprite);
    }
  }
};
createSprite();
```

### 使用THREE.Points创建粒子

通过 `THREE.Sprite` 你可以非常容易地创建一组对象并在场景中移动它们。当你使用少量的对象时，这会很有效，但是如果需要**创建大量的粒子**，如果这时候还是使用 `THREE.Sprite` 的话，就会**产生性能问题**，因为每个对象需要分别由 `Three.js` 进行管理。

`Three.js` 提供了另一种方式来处理大量的粒子，就是使用 `THREE.Points`，通过 `Three.Points`，`Three.js` 不需要管理大量 `THREE.Sprite` 对象，而只需要管理 `THREE.Points` 实例。使用这种方法创建粒子系统时，首先要创建粒子的网格 `THREE.BufferGeometry`，然后创建粒子的材质 `THREE.PointsMaterial`。然后创建两个数组 `veticsFloat32Array` 和 `veticsColors`，用来管理粒子系统中每个粒子的位置和颜色，通过 `THREE.Float32BufferAttribute` 将它们设置为网格属性。最后使用 `THREE.Points` 将创建的网格和材质变为粒子系统添加到场景中。

```javascript
// 创建粒子 Points
const createParticlesByPoints = () => {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    color: 0xfffff,
  });
  const positions = [];
  const colors = [];
  for (let x = -15; x < 15; x++) {
    for (let y = -15; y < 15; y++) {
      positions.push(x * 4, y * 4, 0);
      const randomColor = new THREE.Color(Math.random() * 0xffffff);
      colors.push(randomColor.r, randomColor.g, randomColor.b);
    }
  }

  const positionAttr = new THREE.Float32BufferAttribute(positions, 3);
  const colorsAttr = new THREE.Float32BufferAttribute(colors, 3);
  geometry.attributes.position = positionAttr;
  geometry.attributes.color = colorsAttr;
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
};

createParticlesByPoints();
```



#### `💡 知识点` BufferGeometry

自定义几何体，threejs当中的几何形状都是由BufferGeometry类构建的。BufferGeometry是一个没有任何形状的空几何体，通过BufferGeometry自定义任何几何形状，具体一点说就是定义**顶点数据**。

**创建**

```javascript
const geometry = new THREE.BufferGeometry();
```

**设置几何顶点和颜色**

```javascript
  const positions = [];
  const colors = [];
  for (let x = -15; x < 15; x++) {
    for (let y = -15; y < 15; y++) {
      positions.push(x * 4, y * 4, 0);
      const randomColor = new THREE.Color(Math.random() * 0xffffff);
      colors.push(randomColor.r, randomColor.g, randomColor.b);
    }
  }

```

**通过threejs的属性缓冲区对象`BufferAttribute表示threejs几何体顶点数据和颜色数据`**

```javascript
  const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3);
  const colors = new THREE.Float32BufferAttribute(veticsColors, 3);
  geom.attributes.position = vertices;
  geom.attributes.color = colors;
```

**点模型**

点模型Points和和网格模型Mesh，都是threejs的一种模型对象，只是大部分情况下都是用Mesh表示物体。

网格模型Mesh用自己对应的网格材质，同样点模型Points有自己对应的点才是PointsMaterial

```javascript
  const material = new THREE.PointsMaterial({
    size: 4, //点对象像素尺寸
    vertexColors: true,
    color: 0xffffff
  });
```

```javascript
  const particles = new THREE.Points(geom, material);
  scene.add(particles);
```

### 创建样式化粒子

在上个例子的基础上，我们改造一下创建粒子的方法，通过给 `THREE.PointsMaterial` 动态传入参数的方式来修改粒子的样式。为了能够**实时修改参数并同时能够在页面上查看到参数改变之后的效果**，我们可以使用 `dat.GUI` 库来实现这一功能。首先，通过 `new dat.GUI()` 进行初始化，然后通过 `.add()` 及 `.addColor()` 等方法为它添加控制选项，并在控制选项发生改变时在 `.onChange()` 中调用我们预先写好的回调函数来更新粒子样式。回调函数 `ctrls` 也很简单，就是通过 `scene.getObjectByName("particles")` 找到场景中已经创建好的粒子将它删除，然后使用新的参数再次调用 `createStyledParticlesByPoints` 来创建新的粒子。

```javascript
// 创建样式化粒子
const createStyleParticles = (ctrls) => {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    size: ctrls.size,
    transparent: ctrls.transparent,
    opacity: ctrls.opacity,
    color: new THREE.Color(ctrls.color),
    vertexColors: ctrls.vertexColors,
    sizeAttenuation: ctrls.sizeAttenuation,
  });
  const positions = [];
  const colors = [];
  for (let x = -15; x < 15; x++) {
    for (let y = -15; y < 15; y++) {
      positions.push(x * 4, y * 4, 0);
      const randomColor = new THREE.Color(Math.random() * 0xffffff);
      colors.push(randomColor.r, randomColor.g, randomColor.b);
    }
  }

  const positionAttr = new THREE.Float32BufferAttribute(positions, 3);
  const colorsAttr = new THREE.Float32BufferAttribute(colors, 3);
  geometry.attributes.position = positionAttr;
  geometry.attributes.color = colorsAttr;
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
};

const ctrls = new (function () {
  this.size = 5;
  this.transparent = true;
  this.opacity = 0.6;
  this.vertexColors = true;
  this.color = 0xffffff;
  this.vertexColor = 0x00ff00;
  this.sizeAttenuation = true;
  this.rotate = true;
  this.redraw = function () {
    if (scene.getObjectByName("particles")) {
      scene.remove(scene.getObjectByName("particles"));
    }
    createStyleParticles({
      size: ctrls.size,
      transparent: ctrls.transparent,
      opacity: ctrls.opacity,
      vertexColors: ctrls.vertexColors,
      sizeAttenuation: ctrls.sizeAttenuation,
      color: ctrls.color,
      vertexColor: ctrls.vertexColor,
    });
  };
})();

const gui = new dat.GUI();
gui.add(ctrls, "size", 0, 10).onChange(ctrls.redraw);
gui.add(ctrls, "transparent").onChange(ctrls.redraw);
gui.add(ctrls, "opacity", 0, 1).onChange(ctrls.redraw);
gui.add(ctrls, "vertexColors").onChange(ctrls.redraw);
gui.addColor(ctrls, "color").onChange(ctrls.redraw);
gui.addColor(ctrls, "vertexColor").onChange(ctrls.redraw);
gui.add(ctrls, "sizeAttenuation").onChange(ctrls.redraw);
gui.hide();
ctrls.redraw();
gui.show();
```

### 使用canvas样式化粒子

```javascript
const createParticlesByCanvas = () => {
  const createCanvasTexture = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 300;
    canvas.height = 300;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(170, 120);
    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop("0", "black");
    grd.addColorStop("0.3", "magenta");
    grd.addColorStop("0.5", "blue");
    grd.addColorStop("0.6", "green");
    grd.addColorStop("0.8", "yellow");
    grd.addColorStop(1, "red");
    ctx.strokeStyle = grd;
    ctx.arc(120, 120, 50, 0, Math.PI * 2);
    ctx.stroke();
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // 创建粒子系统
  const createParticles = (
    size,
    transparent,
    opacity,
    sizeAttenuation,
    color
  ) => {
    const geom = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      size: size,
      transparent: transparent,
      opacity: opacity,
      map: createCanvasTexture(),
      sizeAttenuation: sizeAttenuation,
      color: color,
      depthTest: true,
      depthWrite: false,
    });
    let veticsFloat32Array = [];
    const range = 500;
    for (let i = 0; i < 400; i++) {
      const particle = new THREE.Vector3(
        Math.random() * range - range / 2,
        Math.random() * range - range / 2,
        Math.random() * range - range / 2
      );
      veticsFloat32Array.push(particle.x, particle.y, particle.z);
    }
    const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3);
    geom.attributes.position = vertices;
    const particles = new THREE.Points(geom, material);
    scene.add(particles);
  };
  createParticles(40, true, 1, true, 0xffffff);
};

```

###  使用纹理贴图样式化粒子

```javascript
const createParticlesByTexture = () => {
  const createParticles = (size, transparent, opacity, sizeAttenuation, color) => {
    // ...
    const material = new THREE.PointsMaterial({
      'size': size,
      'transparent': transparent,
      'opacity': opacity,
      // 加载自定义图片作为粒子纹理
      'map': new THREE.TextureLoader().load('/images/heart.png'),
      'sizeAttenuation': sizeAttenuation,
      'color': color,
      depthTest: true,
      depthWrite: false
    })
    // ...
  }
}

```

### 在几何中创建粒子

`THREE.Points` 是**基于几何体的顶点来渲染每个粒子**的，利用这一特性我们就可以从高级几何体来创建几何体形状的粒子。下面示例中我们利用 `THREE.SphereGeometry` 来创建一个**球形**的粒子系统。为了营造出好看视觉效果效果，我们可以使用 `Canvas` 的渐变方法 `createRadialGradient` 创建出一种类似**发光特效**来作为粒子的纹理。

```javascript
const createParticlesByGeometry = () => {
  // 创建发光canvas纹理
  const generateSprite = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.4, 'rgba(0, 120, 20, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }
  // 创建立方体
  const sphereGeometry = new THREE.SphereGeometry(15, 32, 16);
  // 创建粒子材质
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 3,
    transparent: true,
    blending: THREE.AdditiveBlending,
    map: generateSprite(),
    depthWrite: false
  })
  const particles = new THREE.Points(sphereGeometry, material)
  scene.add(particles)
}

```

## 5 着色器

着色器是 `WebGL` 的重要组件之一，它是一种使用 `GLSL` 语言编写的运行在 `GPU` 上的程序。顾名思义，着色器用于定位几何体的每个顶点，并为几何体的每个可见像素进行着色 `🎨`。着色器是屏幕上呈现画面之前的最后一步，用它可以实现对先前渲染结果进行修改，如颜色、位置等，也可以对先前渲染的结果做后处理，实现高级的渲染效果。

例如，对于相同场景、相同光照、相同模型等条件下，对这个模型分别使用不同的着色器，就会呈现出完全不同的渲染效果：使用 `plastic shader` 的模型渲染出塑料质感，而使用了 `toon shader` 的模型则看起来是二维卡通效果。

### 5.1 为什么要使用着色器

虽然 `Three.js` 已经内置了非常多的材质，但是在实际开发中很难满足我们的需求，比如在数字孪生系统的开发中，我们经常需要添加一些炫酷的**飞线效果**、**雷达效果**等 `✨`，它们是无法直接使用 `Three.js` 来生成，此时就需要我们创建自己的着色器。而且出于性能的考虑，我们也可以使用自己的着色器材质代替像 `MeshStandardMaterial` 这样的材质非常精细涉及大量代码和计算的材质，以便于提升页面性能。

### 5.2 着色器的类型

#### 1 顶点着色器 Vertex Shader

`Vertex Shader `用于定位几何的顶点，他的工作原理是发送顶点位置、网格变换（position、rotation和scale等）、摄像信息（position、rotation、fov等）。`GPU`将按照`Vertex Shader`中的指令处理这些信息，然后将顶点投影到2d空间中渲染成canvas。

当使用`Vertex Shader`时，它的代码将作用于几何体的每个顶点。在每个顶点之间，有些数据会发生变化，这类数据称为`attribute`；有些数据在顶点之间永远不会变化，称这种数据为`uniform`。`Vertex Shader`会首先触发，当顶点被放置，GPU知道几何体的那些像素可见，然后执行Fragment Shader。

- attribute：使用顶点数组封装每个顶点的数据，一般用于每个顶点都各不相同的变量，如顶点的位置。
- uniform：顶点着色器使用的常量数据，不能被修改，一般用于对同一组顶点组成的单个3d物体中所有顶点都相同的变量，如当前光源的位置。

#### 2 片元着色器Fragment Shader

`Fragment Shader`在`Vertex Shader`之后执行，它的作用是为几何体的每个可见像素进行着色。我们可以通过uniforms将数据发送给它，也可以将`Vertex Shader`中的数据发送给它，我们将这种从`Vertex Shader`发送到`Fragment Shader`的数据称为varying。

`Fragment Shader`中最直接的指令就是可以使用相同的颜色为所有像素进行着色。如果只设置了颜色属性，就相当得到了与MeshBasicMaterial等价的材质。如果我们将光照的位置发送给Fragment Shader，然后根据像素收到光照影响的多少来给像素上色，此时就能得到与MeshPhongMaterial效果等价的材质。

- varying：从顶点着色器发送到片元着色器中的插值计算数据。

### 原始着色器材质RawShaderMaterial

在three.js中可以渲染着色器的材质有两种：`RawShaderMaterial`和`Shaderaterial`，他们之间的区别是ShaderMateria会自动将一些初始化着色器的参数添加到代码中(内置attributes和uniforms)，而RawShaderMaterial则什么都不会添加。

如何使用RawShaderMaterial材质？

1. 创建一个平面
2. 然后和创建其他材质一样，通过new Three.RawShaderMaterial初始化着色器材质
3. 给它添加两个参数vertexShader和fragmentShader代表材质的顶点着色器和片元着色器。

```javascript
const boxGeometry = new THREE.BoxGeometry(5, 0.5, 10, 10);

const material = new THREE.RawShaderMaterial({
  vertexShader: `
    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelMatrix;

    attribute vec3 position;

    void main() {
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision mediump float;

    void main(){
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
});
const mesh = new THREE.Mesh(boxGeometry, material);
scene.add(mesh);
```

### GLSL语言

- 日志：由于着色器语言是针对每个顶点和每个片元执行的，日志记录是没有意义的，因此编写GLSL时没有控制台。
- 缩进：美观即可，无要求
- 分号：结尾必须添加分号
- 类型：强类型。

#### 变量的类型

整形、浮点型、布尔类型。

**二维向量vec2**

​	如果我们需要存储具有x和y属性这样具有两个坐标的值时，可以使用vec2。需要注意的是使用vec2 foo = vec2()这样未添加参数的空值会报错。

```glsl
vec2 foo = vec2(1.0, 2.0);
// 赋值
foo.x = 2.0;
foo.y = 3.0;
// 运算
foo *= 2.0;
```

**三维向量vec3**

与vec2类似，vec3用于表示具有x、y、z三个坐标的值，可以用它非常方便的表示三维空间坐标

```glsl
vec3 boo = vec3(0.0);
vec3 bar = vec3(1.0, 2.0, 3.0);
bar.z = 10.0;
```

表示rgb颜色也同样适合使用vec3表示

```
vec3 color = vec3(0.0);
color.r = 0.5;
color.b = 1.0;
```

可以使用vec2来创建vec3

```
vec2 foo = vec2(1.0, 2.0);
vec3 bar = vec3(foo, 3.0);
```

也可以使用vec3来创建vec2 其中bar的值为`1.0，2.0`, baz的值为`2.0，1.0`

```
vec3 foo = vec3(1.0, 2.0, 3.0);
vec2 bar = foo.xy;
vec2 baz = foo.yx;
```

**四维向量vec4**

与前面类似，四个值命名为`x,y,z,w`或`r,g,b,a`，向量之间同样能进行相互转换：

```
vec4 foo = vec4(1.0, 2.0, 3.0, 4.0);
vec4 bar = vec4(foo.zw, vec2(5.0, 6.0));
```

处上述之外，还有一些其他变量的类型如，mat2、mat3、mat4、sampler2D等。

- 在着色器内，一般命名以gl_开头的变量是着色器的内置变量。

- `webgl_`和`_webgl`是着色器保留字，自定义变量不能以`webgl_`或`_webgl开头`
- 变量声明一般包含 `存储限定符` ` 数据类型`  `变量名名称`，以`attribute vec4 a_position`为例，`attribute`表示存储限定符，`vec4`是数据类型，`a_position`是变量名。

#### 函数

在GLSL中定义函数，必须以返回值的类型开头，如果没有返回值，则可以使用`void`。定义函数的参数时，也必须提供参数类型

```glsl
// 有返回值
float loremIpsum() {
  float a = 1.0;
  float b = 2.0;
  return a + b;
}
// 无返回值
void justDoingStuff() {
  float a = 1.0;
  float b = 2.0;
}
// 定义参数类型
float add(float a, float b) {
  return a + b;
}

```

#### 内置函数

`GLSL` 内置了很多使用的函数，下面列举了一些比较常用的：

- 运算函数
  - `abs(x)`：取 `x` 的绝对值
  - `radians(x)`：角度转弧度
  - `degrees(x)`：弧度转角度
  - `sin(x)`：正弦函数，传入值为弧度。还有 `cos` 余弦函数、`tan` 正切函数、`asin` 反正弦、`acos`反余弦、`atan` 反正切等
  - `pow(x,y)`：`x^y`
  - `exp(x)`：`e^x`
  - `exp2(x)`：`2^x`
  - `log(x)`：`logex`
  - `log2(x)`：`log2x`
  - `sqrt(x)`：`x√`
  - `inversesqr(x)`：`1x√`
  - `sign(x)`：`x>0` 返回 `1.0`，`x<0` 返回 `-1.0`，否则返回 `0.0`
  - `ceil(x)`：返回大于或者等于 `x` 的整数
  - `floor(x)`：返回小于或者等于 `x` 的整数
  - `fract(x)`：返回 `x-floor(x)` 的值
  - `mod(x,y)`：取模求余数
  - `min(x,y)`：获取 `x`、`y` 中小的那个
  - `max(x,y)`：获取 `x`、`y` 中大的那个
  - `mix(x,y,a)`：返回 `x∗(1−a)+y∗a`
  - `step(x,a)`：`x<a`返回 `0.0`，否则返回 `1.0`。
  - `smoothstep(x,y,a)`：`a<x` 返回 `0.0`，`a>y` 返回 `1.0`，否则返回 `0.0-1.0` 之间平滑的 `Hermite` 插值。
  - `dFdx(p)`：`p` 在 `x` 方向上的偏导数
  - `dFdy(p)`：`p` 在 `y` 方向上的偏导数
  - `fwidth(p)`：`p` 在 `x` 和 `y` 方向上的偏导数的绝对值之和
- 几何函数
  - `length(x)`：计算向量 `x` 的长度
  - `distance(x, y)`：返回向量 `xy` 之间的距离
  - `dot(x,y)`：返回向量 `xy` 的点积
  - `cross(x,y)`：返回向量 `xy` 的差积
  - `normalize(x)`：返回与 `x` 向量方向相同，长度为 `1` 的向量
- 矩阵函数
  - `matrixCompMult(x,y)`：将矩阵相乘
  - `lessThan(x,y)`：返回向量 `xy` 的各个分量执行 `x<y` 的结果
  - lessThanEqual(x,y)：返回向量 `xy` 的各个分量执行 `x<=y` 的结果，类似的有类似的有 `greaterThanEqual`
  - `any(bvec x)`：`x` 有一个元素为 `true`，则为 `true`
  - `all(bvec x)`：`x` 所有元素为 `true`，则返回 `true`，否则返回 `false`
  - `not(bvec x)`：`x` 所有分量执行逻辑非运算

> `🔗` 如果想了解更多GLSL的内置函数，可以到这个网站查询：[Kronos Group OpenGL reference pages](https://link.juejin.cn?target=https%3A%2F%2Fwww.khronos.org%2Fregistry%2FOpenGL-Refpages%2Fgl4%2Fhtml%2Findexflat.php)



#### 理解顶点着色器

**顶点着色器**的作用是将几何体的每个顶点放置在`2D`渲染空间上，即顶点着色器将`3D`顶点坐标转换为`2D`canvas坐标。

