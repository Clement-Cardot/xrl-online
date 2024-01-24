import { defineConfig } from "cypress";
import { configurePlugin } from 'cypress-mongodb';
import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

export default defineConfig({
  env: {
    mongodb: {
        uri: uri,
        database: 'xrlonline'
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      configurePlugin(on);
      on('task', {
        Seed_DB() {
          return Seed_MongoDB();
        }
      });
      on('after:run', (results) => {
        Seed_MongoDB();
      })
    },
    experimentalStudio: true,
    baseUrl: "http://localhost:4200",
    viewportHeight: 1080,
    viewportWidth: 1920,
  },
  "reporter": "junit",
  "reporterOptions": {
     "mochaFile": "cypress/results/results-[hash].xml",
     "toConsole": true
  }
});

type Database = {
  users: any[];
  teams: any[];
  business_lines: any[];
  readiness_levels: any[];
  projects: any[];
}

const Seed_MongoDB = async () => {
  // Define the Database
  const db = client.db("xrlonline");

  await db.collection('users').deleteMany({});
  await db.collection('teams').deleteMany({});
  await db.collection('businesslines').deleteMany({});
  await db.collection('readinesslevels').deleteMany({});
  await db.collection('projects').deleteMany({});

  // Insert : Users
  const users = await db.collection('users').insertMany([
      {
          "login":"admin",
          "firstName":"admin",
          "lastName":"admin"
      },
      {
          "login":"cardotcl",
          "firstName":"Clément",
          "lastName":"Cardot"
      },
      {
          "login":"duboisj",
          "firstName":"Jean",
          "lastName":"Dubois"
      },
      {
          "login":"dupontp",
          "firstName":"Pierre",
          "lastName":"Dupont"
      },
      {
          "login":"durandm",
          "firstName":"Marie",
          "lastName":"Durand"
      },
      {
          "login":"martinj",
          "firstName":"Jean",
          "lastName":"Martin"
      },
      {
          "login":"richardt",
          "firstName":"Thomas",
          "lastName":"Richard"
      },
      {
          "login":"robertj",
          "firstName":"Jean",
          "lastName":"Robert"
      },
      {
          "login":"rouxj",
          "firstName":"Jean",
          "lastName":"Roux"
      },
      {
          "login":"vincentm",
          "firstName":"Marie",
          "lastName":"Vincent"
      },
      {
          "login":"berthierj",
          "firstName":"Jean",
          "lastName":"Berthier"
      },
      {
          "login":"davidm",
          "firstName":"Marie",
          "lastName":"David"
      },
      {
          "login":"durandj",
          "firstName":"Jean",
          "lastName":"Durand"
      },
      {
          "login":"fontainem",
          "firstName":"Marie",
          "lastName":"Fontaine"
      },
      {
          "login":"garciaj",
          "firstName":"Jean",
          "lastName":"Garcia"
      },
      {
          "login":"gonzalezm",
          "firstName":"Marie",
          "lastName":"Gonzalez"
      },
      {
          "login":"hervej",
          "firstName":"Jean",
          "lastName":"Hervé"
      },
      {
          "login":"jeanm",
          "firstName":"Marie",
          "lastName":"Jean"
      }
  ]);

  // Insert : Teams
  const teams = await db.collection('teams').insertMany([
      {
          "name":"Team1",
          "members":[
              {
                  $ref: "users",
                  $id: users.insertedIds[0]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[1]
              },
          ]
      },
      {
          "name":"Team2",
          "members":[
              {
                  $ref: "users",
                  $id: users.insertedIds[2]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[3]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[4]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[5]
              }
          ]
      },
      {
          "name":"Team3",
          "members":[
              {
                  $ref: "users",
                  $id: users.insertedIds[6]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[7]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[8]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[9]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[10]
              }
          ]
      },
      {
          "name":"Team4",
          "members":[
              {
                  $ref: "users",
                  $id: users.insertedIds[0]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[1]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[2]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[3]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[4]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[5]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[6]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[7]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[8]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[9]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[10]
              }
          ]
      }
  ]);

  // Insert : Business Lines
  const business_lines = await db.collection('businesslines').insertMany([
      {
          name: "Business Line 1"
      },
      {
          name: "Business Line 2"
      },
      {
          name: "Business Line 3"
      },
      {
          name: "Business Line 4"
      }
  ]);

  // Insert : Readiness Levels
  const readiness_levels = await db.collection('readinesslevels').insertMany([
    {
        name: "Customer",
        description: "Preparedness of potential customers or markets to adopt a new product, service, or technology. It assesses various aspects such as customer awareness, willingness to change, understanding of the offering, and the readiness to commit resources for adoption.",
        levels:[
            {
                level:1,
                shortDescription:"Hypothesis of possible needs in the market.",
                longDescription: [
                    "Thinking (yourself) that a possible need/problem or opportunity might exist in a market",
                    "No clear hypotheses on who customers are, what problems exist, etc. If hypotheses exist they are unclear, speculative, and there is no proof or analysis to support assumptions",
                    "Limited or non-existing knowledge of the market and customers/users"
                ]
            },
            {
                level:2,
                shortDescription:"Identified specific needs in the market.",
                longDescription: [
                    "Some market research is performed, typically derived from secondary sources",
                    "Brief familiarity with the market, possible customers and their problems/needs, and alternatives",
                    "There is a first reasonably clear description of the problem/need hypothesis"
                ]
            },
            {
                level:3,
                shortDescription:"First market feedback established.",
                longDescription: [
                    "Received feedback from primary market research, i.e. direct contacts with e.g. a few possible users/customers or persons with industry/market knowledge (experts)",
                    "A more developed understanding of possible customers and possible customer segments",
                    "The problem/need hypothesis is clear and updated after customer/user/expert feedback"
                ]
            },
            {
                level:4,
                shortDescription:"Confirmed problem/need from several customers or users.",
                longDescription: [
                    "The problem/need and its importance is confirmed from multiple customers or users. Numbers are typically limited but depend on B2B/B2C and market structure (e.g. 5-10 in B2B, if market is concentrated 2-5 market leading customers, in B2C higher e.g. 10-20)",
                    "Customer segmentation with initial basic customer profiles in place",
                    "Identified who the user, paying customer, and decision maker is",
                    "A product/service hypothesis with clear positioning against customer alternatives is defined based on customer/user feedback"
                ]
            },
            {
                level:5,
                shortDescription:"Established interest and relations with customers.",
                longDescription: [
                    "Customers/users have expressed interest for the product/service and confirmed that it can solve customers’ problems/needs (i.e. initial problem-solution fit)",
                    "Established relationships with potential target customers/users providing input",
                    "Decided which target customers/segments to focus on first",
                    "Defined first sales pitch and value proposition adapted to target customer/segment"
                ]
            },
            {
                level:6,
                shortDescription:"Benefits confirmed by first cutomer testing.",
                longDescription: [
                    "Testing of product/service by customers/users has confirmed the customer value and benefits",
                    "Updated sales pitch and value proposition based on customer/user feedback",
                    "Defined first sales/user acquisition process and initiated structured sales activities",
                    "Identified possible partners or key stakeholders relevant to reach customers/users"
                ]
            },
            {
                level:7,
                shortDescription:"Customers in extended testing or first test sales. Small numer of active users.",
                longDescription: [
                    "Customer agreements in place - first sales/test sales of early versions of product/service or customers/users engaged in product/service qualifications or extended testing",
                    "Small number of active users of early versions of product/service",
                    "Discussions initiated with partners to reach customers/users (when relevant)"
                ]
            },
            {
                level:8,
                shortDescription:"First commercial sales and implemented sales process. Substancial numer of active users.",
                longDescription: [
                    "Market ready product/service sold to customers at/near target market price",
                    "Substantial number of active users of market ready product/service (initial customer traction)",
                    "Sales/user acquisition process implemented with dedicated people and support systems (CRM system, etc.)",
                    "Agreements in place with first partners to reach customers (when relevant)"
                ]
            },
            {
                level:9,
                shortDescription:"Widespread sales that scale. Large numer of active users with substancial growth.",
                longDescription: [
                    "Widespread product deployment, sales to several customers in a repeatable and scalable way (including through partners when relevant)",
                    "Large and substantially growing number of active users (significant customer traction)",
                    "Company focuses on business development, customer acquisition, growth of sales, efforts to build user/customer demand, etc."
                ]
            },

        ]
    },
    {
        name: "Technology",
        description: "Technology = Product/service/method/system/technology/solution etc. The “thing”, or tangible realization of the idea, that you want to develop.",
        levels:[
            {
                level:1,
                shortDescription:"Interesting research results or initial technology idea identified.",
                longDescription: [
                    "Research results with potential benefits or useful applications identified",
                    "Vague idea of a technology to be developed"
                ]
            },
            {
                level:2,
                shortDescription:"Technology concept and/or application formulated.",
                longDescription: [
                    "A potential technology concept is defined and described",
                    "Practical applications can be defined/researched but are speculative, and no proof or detailed analysis that the technology will work"
                ]
            },
            {
                level:3,
                shortDescription:"Proof-of-concept of critical functions and/or characteristics. in laboratory.",
                longDescription: [
                    "Tests in the laboratory environment (analytical and/or experimental) of important parameters/features/functions show that the technology concept could work and be feasible",
                    "Laboratory environment = the environment where technology is typically developed, often not the same environment as where it will be used",
                    "Active R&D is initiated to develop the technology further",
                    "There is a first idea of end-user requirements/specifications and/or use cases"
                ]
            },
            {
                level:4,
                shortDescription:"Technology validation in laboratory.",
                longDescription: [
                    "Basic components are integrated and shown to work together and produce desired results in the laboratory environment",
                    "Test results give initial evidence indicating that the technology concept will work (i.e. initial validation)"
                ] 
            },
            {
                level:5,
                shortDescription:"Technology validation in relevant environment.",
                longDescription: [
                    "Basic components are integrated and tested in a more realistic form in a relevant environment",
                    "Test results give evidence indicating that the technology will work (i.e. validation)",
                    "Relevant environment = lab or other controlled environment that simulates the most important and most stressing aspects of the operational environment",
                    "More defined end-user requirements/specifications and/or use cases based on feedback from users"
                ]
            },
            {
                level:6,
                shortDescription:"Technology prototype demonstration in relevant environment.",
                longDescription: [
                    "Representative model or prototype of the technology has been shown to actually work in a relevant environment",
                    "Representative model = a functional form of the technology, generally reduced in scale, near or at operational specification",
                    "Prototype = the technology in a form that can be used to evaluate the technical and/or manufacturing feasibility or utility of the final product",
                    "Shown to actually work (i.e. demonstration) = meet most of the important performance requirements"
                ]
            },
            {
                level:7,
                shortDescription:"Technology prototype demonstration in operational environment.",
                longDescription: [
                    "Prototype near or at the complete technology has been shown to actually work in an operational environment",
                    "Operational environment = environment that addresses all the operational requirements and specifications where the technology will be used by the end-users",
                    "Complete end-user requirements/specifications and/or use cases in place"
                ]
            },
            {
                level:8,
                shortDescription:"Technology complete and demonstrated in actual operations.",
                longDescription: [
                    "Complete technology has been proven to work in actual operations by first users",
                    "Complete technology = Complete - contains everything the user needs to use it; Functional - everything works the way it should for the user to solve their problem/need; Compatible - compatible with people, processes, goals, infrastructure, systems, etc. at the user; Producible - possible to produce at a reasonable cost",
                    "Proven to work = meet all performance requirements/specifications",
                    "Actual operations = implemented by end-users on their own in their day-to-day operations"
                ]
            },
            {
                level:9,
                shortDescription:"Technology complete and proven in actual operations over time.",
                longDescription: [
                    "Complete technology is scalable and proven to work in actual operations by several users over time",
                    "Continuous development, improvement, optimization of technology and production is ongoing"
                ]
            },

        ]
    },
    {
        name: "Business Model",
        description: "Sustainable business model = Revenue ≥ Cost (over time) AND Positive contribution to the environment and society > Negative contribution to the environment and society (over time)",
        levels:[
            {
                level:1,
                shortDescription:"No or unclear hypothesis of possible business idea, market potential, and competition.",
                longDescription: [
                    "Non-existing or vague and unspecific description of the potential business idea, value proposition or business model",
                    "Little insight into the market and its potential/size-hypothesizing on possible applications",
                    "Little knowledge or insight into competition and alternative solutions"
                ] 
            },
            {
                level:2,
                shortDescription:"First hypothesis of possible business concept (in any format) and identified overall market potential and competition.",
                longDescription: [
                    "Described the proposed business concept and value proposition in some structured form",
                    "Brief familiarity with market size, segments, and competitive landscape (listed some competitors/alternatives) – typically derived from secondary sources"
                ]
            },
            {
                level:3,
                shortDescription:"Description of sustainable business model and target market(s), including competition",
                longDescription: [
                    "Description of a proposed business model in place (e.g. in canvas format)",
                    "Description of relevant factors in the business model causing positive and negative contribution to environment and society (see KTH IRL user guide)",
                    "Defined target market(s) and estimates of market size (TAM, SAM)",
                    "Defined competition and identified relevant input from competitive landscape on your business model (competitors’ positioning, business models, prices, etc.)"
                ]
            },
            {
                level:4,
                shortDescription:"First calculations indicating economically viable business model. First assessment indicating environmental and social sustainability.",
                longDescription: [
                    "First version of simplified P&L projections for proposed business model (main costs, main revenue streams) indicate economic viability (based on own assumptions and guesstimates)",
                    "Initial assessment of positive vs negative contribution indicates environmental and social sustainability, based on own assumptions and guesstimates (see KTH IRL user guide)"
                ]
            },
            {
                level:5,
                shortDescription:"Key assumptions in sustainable business model tested on market.",
                longDescription: [
                    "Received feedback on revenue side of business model (e.g. revenue model, pricing, etc.) from a few potential customers or persons with market knowledge (experts)",
                    "Received feedback on cost side of business model (e.g. production, supply chain, etc.) from a few external partners/suppliers/experts",
                    "Key measures to increase positive and decrease negative environmental and social contribution specified in business model (see KTH IRL user guide)",
                    "Updated P&L projection based on market feedback indicates economic viability",
                    "Target market description (target segment(s), TAM, SAM, SOM, and competitive analysis) updated based on market feedback"
                ]
            },
            {
                level:6,
                shortDescription:"Full sustainable business model tested on customers, partners, suppliers (e.g. by test sales), calculations show economic viability.",
                longDescription: [
                    "Complete sustainable business model (cost side and revenue side), including key measures to increase positive and decrease negative environmental and social contribution, is tested in one/a few realistic business scenarios (test sale, pre-order, pilot, tender, etc.)",
                    "Complete financial projections based on feedback from realistic business case show economic viability",
                ]
            },
            {
                level:7,
                shortDescription:"Viability of sustainable business model (pricing, revenue model, etc) validated by initial commercial sales.",
                longDescription: [
                    "First sales/revenue on commercial terms demonstrate willingness to pay from significant number of customers",
                    "Complete financial projections validated by first sales/revenue and data",
                    "Agreements in place with key suppliers, partners, channel partners etc. (aligned with your sustainability expectations) to execute your business model"
                ]
            },
            {
                level:8,
                shortDescription:"Sales and metrics show that sustainable business model is viable.",
                longDescription: [
                    "Sales and other metrics from initial business operations (1-3 years) show sustainable business model holds and can meet internal and external expectations on profit, scalability, and environmental and social impact",
                    "Sales channels and supply chain (aligned with your sustainability expectations) are in place and operational",
                    "Business model is set but is fine-tuned to improve revenue/cost and leverage sustainability"
                ]
            },
            {
                level:9,
                shortDescription:"Sustainable business model proven to meet internal and external expectations on profit, scalability and impact over time.",
                longDescription: [
                    "Sustainable business model is operational and business meets or exceeds internal and external expectations on profit, growth, scalability, and environmental and social impact",
                    "Credible systems and metrics in use to track economic, environmental, social performance",
                    "Historic data on economic, environmental, and social performance proves viable business which is profitable and sustainable over time"
                ]
            },

        ]
    },
    {
        name: "IPR",
        description: "IPR = Intellectual Property Rights = Patents, trademarks, design rights, copyright, database rights, trade secrets, digital registrations (domain names, account names, etc.), company name, etc. (see examples in the tool ”IPR list”)",
        levels:[
            {
                level:1,
                shortDescription:"Hypothesizing on your possible IPR.",
                longDescription: [
                    "Hypothesizing that results or ideas might contain some possible form of IPR",
                    "Some ideas on possible IPR may exist, but are speculative",
                    "No description and documentation of the possible IPR",
                    "Limited knowledge or unclarity regarding relevant legal aspects (ownership, use-rights etc.)",
                    "Limited knowledge of uniqueness and the technical field, state-of-the art, publications etc."
                ]
            },
            {
                level:2,
                shortDescription:"Identified different forms of possible IPR that you have/create. Ownership is clarified and you can use relevant IPR.",
                longDescription: [
                    "Mapped different forms of IPR that exist or could come up during development (see IPR list)",
                    "Specific ideas for IPR exist, but are not well described and defined.",
                    "Agreements related to IP are identified and ownership is clarified. Inventors/creators are clarified. Knowledge of applicable IP policies, potential restrictions in contracts, etc."
                ]
            },
            {
                level:3,
                shortDescription:"Description of possible key IPR in some detail. Initial evaluation of potential to protect key IPR.",
                longDescription: [
                    "Considered what forms of IPR are key/most important and could/should be protected",
                    "Sufficiently detailed description of possible IPR to evaluate possibility for protection",
                    "Evaluation of protection possibilities via e.g. own searches of publications, state-of-the art solutions etc. in the field",
                    "Possibly initial searches or analysis by professional of relevant prior art or conflicting IPR"
                ]
            },
            {
                level:4,
                shortDescription:"Confirmed that IPR protection is possible and for what. Decided why to protect certain IPR (business relevance).",
                longDescription: [
                    "Confirmed possibilities for protection of key IPR through searches/analysis by a professional",
                    "Analyzed (ideally with professional) the key IPR and what the priorities should be for what to protect to create value for the business/project",
                    "Possibly filed first IPR application/registration in some less elaborate form, e.g. own filing of trademark, “provisional” patent application (i.e. not professionally drafted), etc."
                ]
            },
            {
                level:5,
                shortDescription:"Draft of IPR strategy to create business value is in place. Filed first formal applicationregistration of key IPR.",
                longDescription: [
                    "Draft IPR strategy in place - first analysis and plan (preferably by professional) on how different IPR can be used to protect and be of value for the business. (see e.g. tool KTH IPR Strategy)",
                    "First complete formal application/registration of key IPR filed in cooperation with professional",
                    "Basic agreements in place to ascertain control of key IPR (e.g. assignments, ownership, etc.)"
                ]  
            },
            {
                level:6,
                shortDescription:"First complete IPR strategy in place considering different IPR. Positive response on filed applications/registrations.",
                longDescription: [
                    "Complete IPR strategy elaborated (validated by professional) that supports business strategy",
                    "Identified possible complementary/additional IPR to protect",
                    "Initial assessment of freedom-to-operate with the purpose to understand the IPR landscape in the field (who is active, what key IPR) and if you could be dependent on/stopped by other IPR",
                    "Positive response on applications from authorities, and analysis of response performed",
                    "If no positive response: analysis performed together with professional with good prospects"
                ]
            },
            {
                level:7,
                shortDescription:"Filed formal applicationsregistrations of key IPR in relevant countriesfregions according to IPR strategy.",
                longDescription: [
                    "Entered into national/regional phase (US, EU, JP etc.) with key IPR application/registration",
                    "More complete assessment of freedom-to-operate and clear understanding of dependency on/restriction by other IPR"
                ]
            },
            {
                level:8,
                shortDescription:"IPR strategy and management practices fully implemented. Filed formal applications/registrations of complementary IPR.",
                longDescription: [
                    "IPR strategy is fully implemented. IPR is proactively used to support/protect business, IPR related agreements are professionally managed, process for securing new IPR in place",
                    "Key IPR is granted in first country/region with relevant scope for business",
                    "Filed complementary or additional IPR application(s)/registration(s)"
                ]
            },
            {
                level:9,
                shortDescription:"Strong IPR support and protection for business. IPR protection granted and maintained in relevant counties.",
                longDescription: [
                    "IPR strategy is proven to support and create value for business",
                    "Key and complementary IPR is granted and maintained in several countries relevant for business",
                    "Agreements in place to access all necessary external IPR"
                ]
            },

        ]
    },
    {
        name: "Team",
        description: "Team's preparedness and capability to undertake a specific task or project effectively. It evaluates various aspects such as team members' skills, knowledge, experience, collaboration, communication, and the availability of resources required to accomplish objectives.",
        levels:[
            {
                level:1,
                shortDescription:"Lack of necessary competencies/resources to verify idea. Little insight into team needs (typically an individual).",
                longDescription: [
                    "Typically an individual lacking necessary competencies in key areas such as tech, business etc.",
                    "Little insight into needed/necessary competencies and other needed resources (e.g. partners, service providers etc.) to verify and develop the idea"
                ]
            },
            {
                level:2,
                shortDescription:"Limited competencies in place to start verifying the idea. First idea of additional necessary competencies or resources.",
                longDescription: [
                    "Limited competencies and/or capacity present - typically 1-2 persons",
                    "First idea of which additional persons/competencies that could be needed to verify/develop idea",
                    "First idea of overall goal for the project"
                ]
            },
            {
                level:3,
                shortDescription:"Some of necessary competencies in place to verify/develop idea. Defined needed competencies (and plan for finding them).",
                longDescription: [
                    "One or several individuals that possess some, but not all, of necessary competencies and capacity to start verifying the idea",
                    "Needs and gaps in competencies, capacity, and team diversity are identified",
                    "Initial plan is defined for how to find needed prioritized competencies (near-term, <1 year)"
                ]
            },
            {
                level:4,
                shortDescription:"A champion is present with clear idea of direction (startup/other way). Several needed competencies in place, initiated plan to complement.",
                longDescription: [
                    "Team (or individual) has a clear idea of how to take the idea to market (startup, IP deal, etc.)",
                    "At least one champion (driver and committed to take the idea forward) is present",
                    "Several, but not all, necessary competencies are present, typically multiple individuals",
                    "A plan is in place and initiated to find necessary additional competencies and capacity (described e.g. in a requirement profile), keeping in mind team diversity",
                    "The team has started discussions on roles, commitment, ownership, etc. going forward"
                ]
            },
            {
                level:5,
                shortDescription:"Initial founding team with main needed competencies and capacity. Team agrees on ownership, roles, goals, and visions.",
                longDescription: [
                    "An initial founding team working together and all spending significant time. The founding team jointly having main needed competencies and capacity to start building this startup",
                    "Aligned team with clarified roles, shared goals and visions, and clear commitment (e.g. time spent)",
                    "The team has agreed on their respective shares (signed agreement). Ownership is balanced and incentivizing, and reflects historical and future commitment and contribution",
                    "Activities to get additional competencies and capacity in progress, keeping in mind team diversity",
                    "Initial systems/processes/tools in place to share knowledge and information within the team"
                ]
            },
            {
                level:6,
                shortDescription:"Complementary, diverse, and committed founding team with all necessary competencies and capacity to start building a business.",
                longDescription: [
                    "Complementary and diverse founding team in place, capable of starting to build a business",
                    "All key competencies and capacity necessary for the near term are present, incl. a clear CEO",
                    "Committed team where everyone feels responsibility and accountability",
                    "Started recruitment of advisors and/or board members, keeping in mind board diversity",
                    "Awareness of risks to team performance (conflicts, burn-out/mental health, politics, etc.)"
                ]
            },
            {
                level:7,
                shortDescription:"Well-functioning team and culture in place. Growth plan for expanding team and building organization over time.",
                longDescription: [
                    "Well-functioning team with clear roles",
                    "Goals, vision, purpose, and culture are clearly articulated and documented to support team and organizational development",
                    "Plan in place for how to build necessary organization and grow the team over longer term (~2 yrs)",
                    "Processes/systems and plan for continuous learning and staff development implemented",
                    "Board and advisors operational and supporting business and organizational development"
                ]
            },
            {
                level:8,
                shortDescription:"Professional organization in place (board, CEO, management, staff).",
                longDescription: [
                    "There is a clear leadership and management team with relevant professional experience",
                    "Competent and diverse board, and relevant advisors in place and professionally used",
                    "HR policies/processes/responsible in place to assure good HR practices and team diversity",
                    "Necessary recruitments according to longer term plan are ongoing to ascertain relevant competencies, capacity, and diversity in the organization",
                    "All levels of the organization are properly trained and motivated"
                ]
            },
            {
                level:9,
                shortDescription:"High performing, well-structured organization at all levels that is maintained, develops, and performs over time.",
                longDescription: [
                    "The organization is high performing and well-functioning (cooperation, social environment, etc.)",
                    "All levels of the organization actively engaged in continuous learning and development",
                    "Organizational culture, structure, processes etc. are continuously improved and developed",
                    "Incentives/rewards are aligned to motivate the whole organization to reach goals and perform well",
                    "The management team is maintained, developed and performs over time"
                ]
            },

        ]
    },
    {
        name: "Funding",
        description: "Overall readiness to attract investment. Aspects : viability of the business model, market potential, team competence, product/service development stage, intellectual property status, financial projections, and scalability",
        levels:[
            {
                level:1,
                shortDescription:"No clear description of initial verification activities. No clear view of initial funding needs and funding options.",
                longDescription: [
                    "Little or no insight into relevant activities and costs to verify potential/feasibility of the idea",
                    "Little insight into different funding options and funding types."
                ]
            },
            {
                level:2,
                shortDescription:"Description of initial verification activities. Defined funding need and funding sources for initial milestones.",
                longDescription: [
                    "Initial activities and costs to verify potential/feasibility if idea is described (e.g. 1-6 months)",
                    "There is a basic plan with funding options for the initial milestones (e.g. 1-6 months)"
                ]
            },
            {
                level:3,
                shortDescription:"Funding for initial verification plan secured.",
                longDescription: [
                    "Secured sufficient funding for initial verification/feasibility activities (e.g. 1-6 months) ",
                    "Awareness of different funding types (own, soft, equity, customer, etc.) and typical pros/cons"
                ]
            },
            {
                level:4,
                shortDescription:"Funding for elaborated verification plan secured.",
                longDescription: [
                    "Elaborated plan to verify commercial potential of the idea is in place (e.g. 3-12 months, incl. hypotheses to verify, goals, activities, timeline, funding need)",
                    "Identified relevant funding sources",
                    "Secured sufficient funding to implement substantial part of the verification plan"
                ]
            },
            {
                level:5,
                shortDescription:"First pitch for funding tested on relevant audience. Defined near term funding need and decided on funding strategy.",
                longDescription: [
                    "Pitch for funding (e.g. investor pitch format) elaborated and tested on relevant audience",
                    "Initial PnL budget & cash flow for coming 12 months in spreadsheet format",
                    "Decided on funding strategy and funding sources to reach a viable business model - based on pros/cons of the different strategies",
                    "Insight into requirements and consequences of external funding (in particular equity funding) on business model, control, and ownership"
                ]
            },
            {
                level:6,
                shortDescription:"Improved pitch for funding tested on relevant audience. Initiated contacts with relevant external funding sources.",
                longDescription: [
                    "Updated/improved pitch for funding has been tested on relevant audience",
                    "3-5 year PnL budget and cash flow for business/project in spreadsheet format that clarifies near and medium term funding need"
                ]
            },
            {
                level:7,
                shortDescription:"Initial discussions with potential external funding sources. Complete pitch for funding and supporting material ready.",
                longDescription: [
                    "Discussion with potential external funding sources around a defined offer (how much money, for what, conditions, valuation, etc.)",
                    "Pitch for funding is complete, tried, and tested, and a business plan (or equivalent) with financial projections, milestone plan etc. is in place",
                    "Basic accounting systems and documentation in place for financial follow-up"
                ]                    
            },
            {
                level:8,
                shortDescription:"Term sheet level discussions with one or several external funding sources that show clear interest.",
                longDescription: [
                    "Concrete discussions (term sheet level) with one or several external funding sources that clearly are interested",
                    "All necessary supporting material for external funding in place (financials, business plan, etc.)",
                    "Correctly established legal entity with ownership structure suitable for the planned funding source (not fragmented or significant parts held by inactive/non-contributing persons)",
                    "All key legal, IPR, financial, and operational documentation and agreements collected and available for external review (due diligence)"
                ]
            },
            {
                level:9,
                shortDescription:"Secured funding for at least 6-12 months of operations. Financial monitoring and forecasting system fully implemented.",
                longDescription: [
                    "Secured funding for at least 6-12 month runway according to current business plan/operational plan – the money is on the bank account or predictable recurring revenue",
                    "Fully implemented financial monitoring and bookkeeping system for continuous control of current financial status, and good forecast/foresight of future funding needs"
                ]
            },

        ]
    }
  ]);

  // Insert : Projects
  db.collection('projects').insertMany([
    {
        name:"Project 1",
        description:"Description of project 1",
        businessLine: {
            $ref: "businesslines",
            $id: business_lines.insertedIds[0]
        },
        team: {
            $ref: "teams",
            $id: teams.insertedIds[0]
        },
        assessments:[
            {
                date: new Date("2021-08-27T19:00:38.000+00:00"),
                tag:"INITIAL",
                draft:false,
                comment:"First assessment",
                readinessLevelRanks:[
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[0]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[1]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[2]
                        },
                        rank:1,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[3]
                        },
                        rank:3,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[4]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[5]
                        },
                        rank:1,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    }
                ]
            },

            {
                date: new Date("2022-08-27T19:00:38.000+00:00"),
                comment:"assessment 2",
                tag:"INTERMEDIATE",
                draft:false,
                readinessLevelRanks:[
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[0]
                        },
                        rank:5,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[1]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[2]
                        },
                        rank:8,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[3]
                        },
                        rank:9,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[4]
                        },
                        rank:3,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[5]
                        },
                        rank:4,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    }
                ]
            },

            {
                date: new Date("2023-08-27T19:00:38.000+00:00"),
                tag:"INTERMEDIATE",
                draft:true,
                comment:"First assessment",
                readinessLevelRanks:[
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[0]
                        },
                        rank:8,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[1]
                        },
                        rank:9,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[2]
                        },
                        rank:8,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[3]
                        },
                        rank:9,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[4]
                        },
                        rank:7,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[5]
                        },
                        rank:6,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    }
                ]
            }
        ]
    },
    {
        name:"Project 2",
        description:"Description of project 2",
        businessLine: {
            $ref: "businesslines",
            $id: business_lines.insertedIds[0]
        },
        team: {
            $ref: "teams",
            $id: teams.insertedIds[0]
        },
        assessments:[
            {
                date: new Date("2021-08-27T19:00:38.000+00:00"),
                tag:"INITIAL",
                draft:false,
                comment:"First assessment",
                readinessLevelRanks:[
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[0]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[1]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[2]
                        },
                        rank:1,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[3]
                        },
                        rank:3,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[4]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[5]
                        },
                        rank:1,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    }
                ]
            }
        ]
    }
  ]);

  const getDatabase = async (): Promise<Database> => {
      return {
      users: await db.collection('users').find({}).toArray(),
      teams: await db.collection('teams').find({}).toArray(),
      business_lines: await db.collection('businesslines').find({}).toArray(),
      readiness_levels: await db.collection('readinesslevels').find({}).toArray(),
      projects: await db.collection('projects').find({}).toArray()
      }
  }

  return getDatabase();
};