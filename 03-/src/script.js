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

// 直射光
const directionLight = new DirectionalLight(0xffffff, 0.8);
directionLight.position.set(-100, 0, -100);
scene.add(directionLight);

// 点光源
const fillLight = new PointLight(0x88ffee, 2.7, 4, 3);
fillLight.position.set(30, 3, 1.8);
scene.add(fillLight);

// 加载管理
const ftsLoader = document.querySelector(".lds-roller");
const loadingCover = document.getElementById("loading-text-intro");
const loadingManager = new LoadingManager();
loadingManager.onLoad = () => {
  document.querySelector(".content").style.visibility = "visible";
  const yPosition = { y: 0 };
  // 隐藏加载页面动画
  new TWEEN.Tween(yPosition)
    .to({ y: 100 }, 900)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
    .onUpdate(() => {
      loadingCover.style.setProperty(
        "transform",
        `translate(0, ${yPosition.y}%)`
      );
    })
    .onComplete(function () {
      loadingCover.parentNode.removeChild(
        document.getElementById("loading-text-intro")
      );
      TWEEN.remove(this);
    });

  // 使用Tween给相机添加入场动画
  new TWEEN.Tween(camera.position.set(0, 4, 2))
    .to({ x: 0, y: 2.4, z: 5.8 }, 3500)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
    .onComplete(function () {
      TWEEN.remove(this);
      // document.querySelector('.header').classList.add('ended');
      // document.querySelector('.description').classList.add('ended');
    });
  ftsLoader.parentNode.removeChild(ftsLoader);
  window.scroll(0, 0);
};

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

let secondContainer = false;
const intersectionObserver = new IntersectionObserver(
  (entries) => {
    secondContainer = entries[0].intersectionRatio > 0.05;
  },
  { threshold: 0.05 }
);

intersectionObserver.observe(document.querySelector(".second"));

// 页面重绘动画
const clock = new Clock();
let previousTime = 0;
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
