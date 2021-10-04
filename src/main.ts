import { new2d } from "./new-2d/new-2d";
import { selfOverlapping } from "./new-2d/self-overlapping";
import { old2d } from "./old-2d/old-2d";

if (window.location.hash.includes("old-2d")) {
  old2d();
} else if (window.location.hash.includes("new-2d")) {
  new2d();
} else if (window.location.hash.includes("self-overlapping")) {
  selfOverlapping();
}
