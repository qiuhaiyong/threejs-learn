import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import vertexShader from "./glsl/test.vert";
import fragmentShader from "./glsl/test.frag";
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// 初始化渲染器
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGL1Renderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.autoClear = true;

// 初始化场景
const scene = new THREE.Scene();

// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 10;
scene.add(camera);

const boxGeometry = new THREE.BoxGeometry(5, 0.5, 10, 10);
const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  wireframe: true,
});

const mesh = new THREE.Mesh(boxGeometry, material);
scene.add(mesh);

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

const tick = () => {
  controls && controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();
