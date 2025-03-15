"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree,ThreeElement, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElement<typeof ThreeGlobe>;
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

let numbersOfRings: number[] = [0];

// Helper function to validate coordinates
function isValidCoordinate(value: number): boolean {
  return (
    value !== undefined && value !== null && !isNaN(value) && isFinite(value)
  );
}

// Helper function to validate position data
function isValidPosition(pos: Position): boolean {
  return (
    isValidCoordinate(pos.startLat) &&
    isValidCoordinate(pos.startLng) &&
    isValidCoordinate(pos.endLat) &&
    isValidCoordinate(pos.endLng) &&
    isValidCoordinate(pos.arcAlt) &&
    isValidCoordinate(pos.order) &&
    typeof pos.color === "string" &&
    pos.color.trim().length > 0 // Ensure color is a non-empty string
  );
}

// Helper function to validate and sanitize color
function sanitizeColor(color: string): string {
  if (!color || typeof color !== "string") return "#062056"; // Fallback to white
  return color.trim();
}

export function Globe({ globeConfig, data }: WorldProps) {
  const validData = data ? data.filter(isValidPosition) : [];
  const [globeData, setGlobeData] = useState<
    | {
        size: number;
        order: number;
        color: (t: number) => string;
        lat: number;
        lng: number;
      }[]
    | null
  >(null);

  const globeRef = useRef<ThreeGlobe | null>(null);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    if (globeRef.current) {
      _buildData();
      _buildMaterial();
    }
  }, [globeRef.current]);

  const _buildMaterial = () => {
    if (!globeRef.current) return;
    try {
      const globeMaterial = globeRef.current.globeMaterial() as unknown as {
        color: Color;
        emissive: Color;
        emissiveIntensity: number;
        shininess: number;
      };

      globeMaterial.color = new Color(
        globeConfig.globeColor
      );
      globeMaterial.emissive = new Color(
        globeConfig.emissive
      );
      globeMaterial.emissiveIntensity =
        globeConfig.emissiveIntensity || defaultProps.emissiveIntensity;
      globeMaterial.shininess = globeConfig.shininess || defaultProps.shininess;
    } catch (err) {
      console.error("Error building material:", err);
    }
  };

  const _buildData = () => {
    try {
      if (!validData || validData.length === 0) {
        console.warn("No valid position data found for the globe.");
        setGlobeData([]);
        return;
      }

      let points: {
        size: number;
        order: number;
        color: (t: number) => string;
        lat: number;
        lng: number;
      }[] = [];

      for (let i = 0; i < validData.length; i++) {
        const arc = validData[i];
        const rgb = hexToRgb(arc.color);

        if (!rgb) continue;

        if (
          isValidCoordinate(arc.startLat) &&
          isValidCoordinate(arc.startLng)
        ) {
          points.push({
            size: defaultProps.pointSize,
            order: arc.order,
            color: (t: number) =>
              `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
            lat: arc.startLat,
            lng: arc.startLng,
          });
        }

        if (isValidCoordinate(arc.endLat) && isValidCoordinate(arc.endLng)) {
          points.push({
            size: defaultProps.pointSize,
            order: arc.order,
            color: (t: number) =>
              `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
            lat: arc.endLat,
            lng: arc.endLng,
          });
        }
      }

      // Final validation to ensure no NaN values
      points = points.filter(
        (p) =>
          isValidCoordinate(p.lat) &&
          isValidCoordinate(p.lng) &&
          isValidCoordinate(p.order) &&
          isValidCoordinate(p.size)
      );

      // Remove duplicates for same lat and lng
      const filteredPoints = points.filter(
        (v, i, a) =>
          a.findIndex((v2) =>
            ["lat", "lng"].every(
              (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"]
            )
          ) === i
      );

      setGlobeData(filteredPoints);
    } catch (err) {
      console.error("Error building data:", err);
      setGlobeData([]);
    }
  };

  useEffect(() => {
    if (!globeRef.current || !globeData || globeData.length === 0) return;

    try {
      // Validate countries data
      const validFeatures = countries.features.filter(
        (feature) => feature && feature.geometry && feature.geometry.coordinates
      );

      globeRef.current
        .hexPolygonsData(validFeatures)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor(() => defaultProps.polygonColor);

      startAnimation();
    } catch (err) {
      console.error("Error setting up globe:", err);
    }
  }, [globeData]);

  const startAnimation = () => {
    if (
      !globeRef.current ||
      !globeData ||
      globeData.length === 0 ||
      !validData ||
      validData.length === 0
    )
      return;

    try {
      globeRef.current
        .arcsData(validData)
        .arcStartLat((d) => (d as Position).startLat)
        .arcStartLng((d) => (d as Position).startLng)
        .arcEndLat((d) => (d as Position).endLat)
        .arcEndLng((d) => (d as Position).endLng)
        .arcColor((d) => sanitizeColor((d as Position).color)) // Sanitize color
        .arcAltitude((d) => (d as Position).arcAlt)
        .arcStroke(() => [0.32, 0.28, 0.3][Math.floor(Math.random() * 3)])
        .arcDashLength(defaultProps.arcLength)
        .arcDashInitialGap((d) => (d as Position).order)
        .arcDashGap(15)
        .arcDashAnimateTime(() => defaultProps.arcTime);

      globeRef.current
        .pointsData(globeData)
        .pointColor((d) => sanitizeColor((d as any).color)) // Sanitize color
        .pointsMerge(true)
        .pointAltitude(0.0)
        .pointRadius(2);

      globeRef.current
        .ringsData([])
        .ringColor((e: any) => (t: any) => sanitizeColor(e.color(t))) // Sanitize color
        .ringMaxRadius(defaultProps.maxRings)
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod(
          (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
        );
    } catch (err) {
      console.error("Error starting animation:", err);
    }
  };

  useEffect(() => {
    if (!globeRef.current || !globeData || globeData.length === 0) return;

    const interval = setInterval(() => {
      if (!globeRef.current || !globeData || globeData.length === 0) return;

      try {
        const maxIndex = Math.max(0, globeData.length - 1);
        if (maxIndex <= 0) {
          globeRef.current.ringsData([]);
          return;
        }

        const count = Math.min(
          Math.max(1, Math.floor((maxIndex * 4) / 5)),
          maxIndex
        );
        numbersOfRings = genRandomNumbers(0, maxIndex + 1, count);
        if (numbersOfRings.length === 0) numbersOfRings = [0];

        const ringsData = globeData.filter((d, i) =>
          numbersOfRings.includes(i)
        );
        if (ringsData.length > 0) {
          globeRef.current.ringsData(ringsData);
        }
      } catch (err) {
        console.error("Error updating rings:", err);
        if (globeRef.current) {
          globeRef.current.ringsData([]);
        }
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [globeRef.current, globeData]);

  if (validData.length === 0) {
    return null;
  }

  return (
    <>
      <threeGlobe ref={globeRef} />
    </>
  );
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    try {
      gl.setPixelRatio(window.devicePixelRatio);
      gl.setSize(size.width, size.height);
      gl.setClearColor(0xffaaff, 0);
    } catch (err) {
      console.error("Error configuring WebGL renderer:", err);
    }
  }, [gl, size]);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const validData = props.data ? props.data.filter(isValidPosition) : [];
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);

  if (validData.length === 0) {
    console.warn("No valid position data provided to World component");
  }

  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
      <ambientLight
        color={globeConfig.ambientLight}
        intensity={0.6}
      />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe globeConfig={globeConfig} data={validData} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={globeConfig.autoRotateSpeed || 1}
        autoRotate={
          globeConfig.autoRotate !== undefined ? globeConfig.autoRotate : true
        }
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: string) {
  if (!hex || typeof hex !== "string") return { r: 0, g: 0, b: 0 };

  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  if (min >= max || count <= 0 || max - min < count) {
    return [min];
  }

  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}
