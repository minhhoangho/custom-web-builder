export const template2 = {
  id: 2,
  tables: [
    {
      id: 0,
      name: "employees",
      x: 365,
      y: 20,
      fields: [
        {
          name: "id",
          type: "INT",
          default: "",
          check: "",
          primary: true,
          unique: true,
          notNull: true,
          increment: true,
          comment: "",
          id: 0,
        },
        {
          name: "first_name",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 1,
          size: 255,
        },
        {
          name: "last_name",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 2,
          size: 255,
        },
        {
          name: "dob",
          type: "DATE",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 3,
          size: "",
          values: [],
        },
        {
          name: "dep_id",
          type: "INT",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 4,
        },
        {
          name: "pos_id",
          type: "INT",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 5,
        },
      ],
      comment: "",
      indices: [],
      color: "#a751e8",
    },
    {
      id: 1,
      name: "department",
      x: 41,
      y: 59,
      fields: [
        {
          name: "id",
          type: "INT",
          default: "",
          check: "",
          primary: true,
          unique: true,
          notNull: true,
          increment: true,
          comment: "",
          id: 0,
        },
        {
          name: "name",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 1,
          size: 255,
        },
      ],
      comment: "",
      indices: [],
      color: "#6360f7",
    },
    {
      id: 2,
      name: "positions",
      x: 37,
      y: 284,
      fields: [
        {
          name: "id",
          type: "INT",
          default: "",
          check: "",
          primary: true,
          unique: true,
          notNull: true,
          increment: true,
          comment: "",
          id: 0,
        },
        {
          name: "name",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 1,
          size: 255,
        },
        {
          name: "salary",
          type: "DOUBLE",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 2,
          size: "",
        },
      ],
      comment: "",
      indices: [],
      color: "#3cde7d",
    },
    {
      id: 3,
      name: "projects",
      x: 668,
      y: 28,
      fields: [
        {
          name: "id",
          type: "INT",
          default: "",
          check: "",
          primary: true,
          unique: true,
          notNull: true,
          increment: true,
          comment: "",
          id: 0,
        },
        {
          name: "name",
          type: "VARCHAR",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 1,
          size: 255,
        },
        {
          name: "description",
          type: "TEXT",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 2,
          size: 65535,
        },
        {
          name: "start_date",
          type: "DATE",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 3,
          size: "",
          values: [],
        },
        {
          name: "end_date",
          type: "DATE",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 4,
          size: "",
          values: [],
        },
      ],
      comment: "",
      indices: [],
      color: "#7d9dff",
    },
    {
      id: 4,
      name: "project_assignment",
      x: 684,
      y: 295,
      fields: [
        {
          name: "id",
          type: "INT",
          default: "",
          check: "",
          primary: true,
          unique: true,
          notNull: true,
          increment: true,
          comment: "",
          id: 0,
        },
        {
          name: "project_id",
          type: "INT",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 1,
        },
        {
          name: "employee_id",
          type: "INT",
          default: "",
          check: "",
          primary: false,
          unique: false,
          notNull: false,
          increment: false,
          comment: "",
          id: 2,
        },
      ],
      comment: "",
      indices: [],
      color: "#32c9b0",
    },
  ],
  relationships: [
    {
      startTableId: 0,
      startFieldId: 4,
      endTableId: 1,
      endFieldId: 0,
      name: "employees_dep_id_fk",
      cardinality: "Many to one",
      updateConstraint: "No action",
      deleteConstraint: "No action",
      id: 0,
    },
    {
      startTableId: 0,
      startFieldId: 5,
      endTableId: 2,
      endFieldId: 0,
      name: "employees_pos_id_fk",
      cardinality: "One to one",
      updateConstraint: "No action",
      deleteConstraint: "No action",
      id: 1,
    },
    {
      startTableId: 4,
      startFieldId: 1,
      endTableId: 3,
      endFieldId: 0,
      name: "project_assignment_project_id_fk",
      cardinality: "One to one",
      updateConstraint: "No action",
      deleteConstraint: "No action",
      id: 2,
    },
    {
      startTableId: 4,
      startFieldId: 2,
      endTableId: 0,
      endFieldId: 0,
      name: "project_assignment_employee_id_fk",
      cardinality: "Many to one",
      updateConstraint: "No action",
      deleteConstraint: "No action",
      id: 3,
    },
  ],
  notes: [],
  subjectAreas: [],
  types: [],
  title: "Human resources schema",
  description:
    "A Human Resources (HR) schema designed to manage employee and project related information within an organization.",
  custom: 0,
};
