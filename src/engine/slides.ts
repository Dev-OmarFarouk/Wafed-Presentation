import { lazy } from "react";
import type { ComponentType } from "react";
import type { SlideDef, SlideProps, TransitionKind } from "./types";

type SlideModule = { default: ComponentType<SlideProps> };

const loadIntro = () => import("../slides/s01-intro");
const loadTeam = () => import("../slides/s02-team");
const loadStudentChallenges = () => import("../slides/s03-student-challenges");
const loadOwnerChallenges = () => import("../slides/s03-owner-challenges");
const loadSolutions = () => import("../slides/s04-solutions");
const loadSolutionsB = () => import("../slides/s04-solutions-b");
const loadFeatures = () => import("../slides/s04-features");
const loadOverview = () => import("../slides/s05-overview");
const loadAudience = () => import("../slides/s06-audience");
const loadPersonaStudent = () => import("../slides/s07-persona-student");
const loadPersonaOwner = () => import("../slides/s08-persona-owner");
const loadSwot = () => import("../slides/s09-swot");
const loadCompetition = () => import("../slides/s10-competition");
const loadIdentity = () => import("../slides/s11-identity");
const loadLogo = () => import("../slides/s12-logo");
const loadJourneyStart = () => import("../slides/s12-journey-start");
const loadJourneyStudent = () => import("../slides/s13-journey-student");
const loadJourneyOwner = () => import("../slides/s14-journey-owner");

function define(
  id: string,
  title: string,
  steps: number,
  transition: TransitionKind,
  load: () => Promise<SlideModule>
): SlideDef {
  return { id, title, steps, transition, Component: lazy(load), preload: load };
}

export const slides: SlideDef[] = [
  define("intro", "وافد", 1, "goldPath", loadIntro),
  define("team", "أعضاء الفريق", 5, "zoom", loadTeam),
  define("challenges-student", "تحديات الطالب", 5, "shared", loadStudentChallenges),
  define("challenges-owner", "تحديات صاحب السكن", 7, "parallax", loadOwnerChallenges),
  define("solutions", "الحلول", 4, "shared", loadSolutions),
  define("solutions-b", "الحلول", 4, "parallax", loadSolutionsB),
  define("features", "الخصائص الأساسية", 6, "zoom", loadFeatures),
  define("overview", "نظرة على المشروع", 4, "parallax", loadOverview),
  define("audience", "الفئة المستهدفة", 2, "circle", loadAudience),
  define("persona-student", "صوت الطلاب", 7, "zoom", loadPersonaStudent),
  define("persona-owner", "صوت أصحاب السكن", 7, "parallax", loadPersonaOwner),
  define("swot", "تحليل SWOT", 5, "circle", loadSwot),
  define("competition", "المنافسة", 7, "parallax", loadCompetition),
  define("identity", "الخط والألوان", 1, "curtain", loadIdentity),
  define("logo", "الشعار", 5, "zoom", loadLogo),
  define("journey-start", "مسار البداية", 8, "goldPath", loadJourneyStart),
  define("journey-student", "مسار الطالب", 9, "parallax", loadJourneyStudent),
  define("journey-owner", "مسار المالك", 10, "zoom", loadJourneyOwner),
];
