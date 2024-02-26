import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 120;
camera.lookAt(new THREE.Vector3(0, 0, 0));
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

// 创建粒子 Sprite
const createParticlesBySprite = () => {
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
// createSprite();

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

// createParticlesByPoints();

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
// ctrls.redraw();
// gui.show();

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

// createParticlesByCanvas();

const createParticlesByGeometry = () => {
  // 创建发光canvas纹理
  const generateSprite = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(0, 255, 0, 1)");
    gradient.addColorStop(0.4, "rgba(0, 120, 20, 1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  const sphereGeometry = new THREE.SphereGeometry(30, 32, 16);
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 3,
    transparent: true,
    blending: THREE.AdditiveBlending,
    map: generateSprite(),
    depthWrite: false,
  });

  const particles = new THREE.Points(sphereGeometry, material);
  scene.add(particles);
};
// createParticlesByGeometry();

const spaceCase = () => {
  let astronaut;
  const loader = new GLTFLoader();
  loader.load("/models/astronaut.glb", (mesh) => {
    astronaut = mesh.scene;
    astronaut.material = new THREE.MeshLambertMaterial();
    console.log(astronaut);
    astronaut.position.y = -10;
    astronaut.scale.set(0.25, 0.25, 0.25);
    scene.add(astronaut);
  });

  const rand = (min, max) => min + Math.random() * (max - min);
  const geom = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 10,
    map: new THREE.TextureLoader().load("/images/particle.png"),
  });

  let veticsFloat32Array = [];
  let veticsColors = [];
  for (let i = 0; i < 1000; i++) {
    veticsFloat32Array.push(
      rand(40, 60) * Math.cos(i),
      rand(40, 50) * Math.sin(i),
      rand(-1500, 0)
    );
    const randomColor = new THREE.Color(Math.random() * 0xffffff);
    veticsColors.push(randomColor.r, randomColor.g, randomColor.b);
  }
  const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3);
  const colors = new THREE.Float32BufferAttribute(veticsColors, 3);
  geom.attributes.position = vertices;
  geom.attributes.color = colors;
  const particleSystem = new THREE.Points(geom, material);
  scene.add(particleSystem);

  // 设置光照

  let light = new THREE.PointLight(0xffffff, 0.5);
  light.position.x = -50;
  light.position.y = -50;
  light.position.z = 75;
  scene.add(light);
  light = new THREE.PointLight(0xffffff, 0.5);
  light.position.x = 50;
  light.position.y = 50;
  light.position.z = 75;
  scene.add(light);
  light = new THREE.PointLight(0xffffff, 0.3);
  light.position.x = 25;
  light.position.y = 50;
  light.position.z = 200;
  scene.add(light);
  light = new THREE.AmbientLight(0xffffff, 0.02);
  scene.add(light);

  let t = 0;
  const updateParticles = () => {
    particleSystem.position.x = 0.2 * Math.cos(t);
    particleSystem.position.y = 0.2 * Math.cos(t);
    particleSystem.rotation.z += 0.015;
    camera.lookAt(particleSystem.position);
    for (let i = 0; i < veticsFloat32Array.length; i++) {
      if ((i + 1) % 3 === 0) {
        const dist = veticsFloat32Array[i] - camera.position.z;
        if (dist >= 0) veticsFloat32Array[i] = rand(-1000, -500);
        veticsFloat32Array[i] += 2.5;
        const _vertices = new THREE.Float32BufferAttribute(
          veticsFloat32Array,
          3
        );
        geom.attributes.position = _vertices;
      }
    }
    particleSystem.geometry.verticesNeedUpdate = true;
  };

  const updateMeshes = () => {
    if (astronaut) {
      astronaut.position.z = 0.08 * Math.sin(t);
      astronaut.rotation.x += 0.015;
      astronaut.rotation.y += 0.015;
      astronaut.rotation.z += 0.01;
    }
  };

  const tick = () => {
    updateParticles();
    updateMeshes();
    controls && controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
    t += 0.01;
  };
  tick();
};

// spaceCase();

// const tick = () => {
//   updateParticles();
//   controls && controls.update();
//   renderer.render(scene, camera);
//   requestAnimationFrame(tick);
// };
// tick();
