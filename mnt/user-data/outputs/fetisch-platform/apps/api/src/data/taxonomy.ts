export const taxonomySeed = {
  version: "1.0",
  categories: [
    {
      id: "bdsm",
      name: "BDSM & Power Dynamics",
      level: 1,
      subcategories: [
        {
          id: "bdsm.dominance",
          name: "Dominanz",
          level: 2,
          tags: [
            {
              id: "bdsm.dominance.strict_mistress",
              name: "Strenge Herrin",
              nameEn: "Strict Mistress",
              level: 3,
              objects: ["whip", "leather_glove", "cane"],
              personalityIndicators: {
                extraversion: 0.7,
                conscientiousness: 0.8,
                agreeableness: 0.3
              }
            },
            {
              id: "bdsm.dominance.caring_dom",
              name: "Fürsorgliche Domme",
              nameEn: "Caring Domme",
              level: 3,
              objects: ["collar", "leash", "soft_restraints"],
              personalityIndicators: {
                extraversion: 0.5,
                agreeableness: 0.7
              }
            },
            {
              id: "bdsm.dominance.sadistic",
              name: "Sadistische Dominanz",
              nameEn: "Sadistic Dom",
              level: 3,
              objects: ["whip", "paddle", "clamps"],
              personalityIndicators: {
                extraversion: 0.6,
                agreeableness: 0.2
              }
            },
            {
              id: "bdsm.dominance.master",
              name: "Master/Owner",
              nameEn: "Master/Owner",
              level: 3,
              objects: ["collar", "chain", "leash"],
              personalityIndicators: {
                conscientiousness: 0.8,
                extraversion: 0.5
              }
            }
          ]
        },
        {
          id: "bdsm.submission",
          name: "Submission",
          level: 2,
          tags: [
            {
              id: "bdsm.submission.obedient",
              name: "Gehorsamer Sklave",
              nameEn: "Obedient Slave",
              level: 3,
              objects: ["collar", "cuffs", "leash"],
              personalityIndicators: {
                agreeableness: 0.8,
                conscientiousness: 0.7
              }
            },
            {
              id: "bdsm.submission.brat",
              name: "Brat (frech)",
              nameEn: "Brat",
              level: 3,
              objects: ["paddle", "gag"],
              personalityIndicators: {
                extraversion: 0.6,
                agreeableness: 0.4
              }
            },
            {
              id: "bdsm.submission.service",
              name: "Service Sub",
              nameEn: "Service Sub",
              level: 3,
              objects: ["cleaning_supplies", "serving_tray"],
              personalityIndicators: {
                conscientiousness: 0.8,
                agreeableness: 0.8
              }
            },
            {
              id: "bdsm.submission.pain_slut",
              name: "Pain Slut",
              nameEn: "Pain Slut",
              level: 3,
              objects: ["whip", "clamps", "needles"],
              personalityIndicators: {
                openness: 0.8,
                neuroticism: 0.6
              }
            }
          ]
        },
        {
          id: "bdsm.bondage",
          name: "Bondage",
          level: 2,
          tags: [
            {
              id: "bdsm.bondage.shibari",
              name: "Shibari/Kinbaku",
              nameEn: "Shibari/Kinbaku",
              level: 3,
              objects: ["jute_rope", "hemp_rope"],
              personalityIndicators: {
                openness: 0.7,
                conscientiousness: 0.7
              }
            },
            {
              id: "bdsm.bondage.western",
              name: "Western Bondage",
              nameEn: "Western Bondage",
              level: 3,
              objects: ["rope", "cuffs", "spreader_bar"]
            },
            {
              id: "bdsm.bondage.suspension",
              name: "Suspension",
              nameEn: "Suspension",
              level: 3,
              objects: ["suspension_rope", "carabiner", "harness"]
            },
            {
              id: "bdsm.bondage.mummification",
              name: "Mumifizierung",
              nameEn: "Mummification",
              level: 3,
              objects: ["plastic_wrap", "duct_tape", "bodybag"]
            }
          ]
        },
        {
          id: "bdsm.impact",
          name: "Impact Play",
          level: 2,
          tags: [
            {
              id: "bdsm.impact.spanking",
              name: "Spanking (Hand)",
              nameEn: "Spanking",
              level: 3,
              objects: ["hand"]
            },
            {
              id: "bdsm.impact.paddle",
              name: "Paddle",
              nameEn: "Paddle",
              level: 3,
              objects: ["wooden_paddle", "leather_paddle"]
            },
            {
              id: "bdsm.impact.whip",
              name: "Peitsche",
              nameEn: "Whip",
              level: 3,
              objects: ["single_tail", "bull_whip", "flogger"]
            },
            {
              id: "bdsm.impact.cane",
              name: "Rohrstock",
              nameEn: "Cane",
              level: 3,
              objects: ["rattan_cane", "bamboo_cane"]
            }
          ]
        }
      ]
    },
    {
      id: "roleplay",
      name: "Rollenspiele & Identitäten",
      level: 1,
      subcategories: [
        {
          id: "roleplay.ageplay",
          name: "Age Play",
          level: 2,
          tags: [
            {
              id: "roleplay.ageplay.abdl_baby",
              name: "ABDL Baby",
              nameEn: "ABDL Baby",
              level: 3,
              objects: ["diaper", "pacifier", "bottle", "onesie"],
              personalityIndicators: {
                openness: 0.8,
                neuroticism: 0.6
              }
            },
            {
              id: "roleplay.ageplay.abdl_toddler",
              name: "ABDL Kleinkind",
              nameEn: "ABDL Toddler",
              level: 3,
              objects: ["training_pants", "sippy_cup", "toys"]
            },
            {
              id: "roleplay.ageplay.little",
              name: "Little (allgemein)",
              nameEn: "Little",
              level: 3,
              objects: ["stuffed_animal", "coloring_book", "pacifier"]
            },
            {
              id: "roleplay.ageplay.daddy_dom",
              name: "Daddy Dom",
              nameEn: "Daddy Dom",
              level: 3,
              objects: ["paddle", "stuffed_animal"]
            },
            {
              id: "roleplay.ageplay.mommy_dom",
              name: "Mommy Domme",
              nameEn: "Mommy Domme",
              level: 3,
              objects: ["bottle", "diaper", "brush"]
            }
          ]
        },
        {
          id: "roleplay.petplay",
          name: "Pet Play",
          level: 2,
          tags: [
            {
              id: "roleplay.petplay.dog",
              name: "Puppy/Dog",
              nameEn: "Puppy/Dog",
              level: 3,
              objects: ["dog_collar", "leash", "dog_bowl", "tail_plug"],
              personalityIndicators: {
                agreeableness: 0.7,
                extraversion: 0.5
              }
            },
            {
              id: "roleplay.petplay.cat",
              name: "Kätzchen/Katze",
              nameEn: "Kitten/Cat",
              level: 3,
              objects: ["cat_ears", "collar", "tail", "bell"]
            },
            {
              id: "roleplay.petplay.pony",
              name: "Pony",
              nameEn: "Pony",
              level: 3,
              objects: ["bit_gag", "harness", "hoof_mitts", "tail"]
            },
            {
              id: "roleplay.petplay.pig",
              name: "Schwein",
              nameEn: "Pig",
              level: 3,
              objects: ["snout", "trough", "pig_tail"]
            }
          ]
        },
        {
          id: "roleplay.crossdressing",
          name: "Crossdressing/Sissification",
          level: 2,
          tags: [
            {
              id: "roleplay.crossdressing.sissy",
              name: "Sissy",
              nameEn: "Sissy",
              level: 3,
              objects: ["lingerie", "heels", "wig", "makeup"]
            },
            {
              id: "roleplay.crossdressing.maid",
              name: "Sissy Maid",
              nameEn: "Sissy Maid",
              level: 3,
              objects: ["maid_outfit", "feather_duster", "heels"]
            },
            {
              id: "roleplay.crossdressing.feminization",
              name: "Forced Feminization",
              nameEn: "Forced Feminization",
              level: 3,
              objects: ["dress", "makeup", "wig", "heels"]
            }
          ]
        }
      ]
    },
    {
      id: "materials",
      name: "Material-Fetische",
      level: 1,
      subcategories: [
        {
          id: "materials.latex",
          name: "Latex/Gummi",
          level: 2,
          tags: [
            {
              id: "materials.latex.catsuit",
              name: "Latex Catsuit",
              nameEn: "Latex Catsuit",
              level: 3,
              objects: ["latex_catsuit"]
            },
            {
              id: "materials.latex.gloves",
              name: "Latex Handschuhe",
              nameEn: "Latex Gloves",
              level: 3,
              objects: ["latex_gloves"]
            },
            {
              id: "materials.latex.mask",
              name: "Latex Maske",
              nameEn: "Latex Mask",
              level: 3,
              objects: ["latex_hood", "latex_mask"]
            }
          ]
        },
        {
          id: "materials.leather",
          name: "Leder",
          level: 2,
          tags: [
            {
              id: "materials.leather.harness",
              name: "Leder Harness",
              nameEn: "Leather Harness",
              level: 3,
              objects: ["leather_harness"]
            },
            {
              id: "materials.leather.boots",
              name: "Lederstiefel",
              nameEn: "Leather Boots",
              level: 3,
              objects: ["leather_boots"]
            }
          ]
        },
        {
          id: "materials.nylon",
          name: "Nylon/Strumpfhosen",
          level: 2,
          tags: [
            {
              id: "materials.nylon.stockings",
              name: "Strümpfe",
              nameEn: "Stockings",
              level: 3,
              objects: ["stockings", "garter_belt"]
            },
            {
              id: "materials.nylon.pantyhose",
              name: "Strumpfhose",
              nameEn: "Pantyhose",
              level: 3,
              objects: ["pantyhose"]
            }
          ]
        }
      ]
    },
    {
      id: "body",
      name: "Körper-Fokus",
      level: 1,
      subcategories: [
        {
          id: "body.feet",
          name: "Füße",
          level: 2,
          tags: [
            {
              id: "body.feet.worship",
              name: "Fußverehrung",
              nameEn: "Foot Worship",
              level: 3,
              objects: ["feet", "shoes", "socks"]
            },
            {
              id: "body.feet.trampling",
              name: "Trampling",
              nameEn: "Trampling",
              level: 3,
              objects: ["heels", "boots", "bare_feet"]
            }
          ]
        }
      ]
    },
    {
      id: "fluids",
      name: "Körperflüssigkeiten",
      level: 1,
      subcategories: [
        {
          id: "fluids.watersports",
          name: "Watersports",
          level: 2,
          tags: [
            {
              id: "fluids.watersports.golden_shower",
              name: "Golden Shower",
              nameEn: "Golden Shower",
              level: 3,
              objects: ["shower", "toilet"]
            }
          ]
        }
      ]
    }
  ]
};
