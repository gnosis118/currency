const fs = require('fs');

// Read the current blogPosts.ts file
let blogPostsContent = fs.readFileSync('/home/ubuntu/currency/src/data/blogPosts.ts', 'utf8');

// Add new image imports at the top
const newImports = `
import topBrokersRankingChart from '@/assets/top-5-brokers-ranking-chart-2025.png';
import brokerComparisonTableChart from '@/assets/broker-comparison-table-chart-2025.png';
import freelancerPaymentMethods from '@/assets/freelancer-payment-methods-2025.png';
import freelancerPaymentOptions from '@/assets/freelancer-payment-options-2025.jpg';
import nomadRemoteWorkLifestyle from '@/assets/nomad-remote-work-lifestyle-2025.jpeg';
import nomadMoneyManagement from '@/assets/nomad-money-management-2025.png';
import businessHedgingStrategies from '@/assets/business-hedging-strategies-2025.webp';
import forexRiskManagement from '@/assets/forex-risk-management-2025.png';
import travelMoneyManagement from '@/assets/travel-money-management-2025.jpg';
import travelBudgetTemplate from '@/assets/travel-budget-template-2025.jpg';`;

// Find the last import statement and add new imports after it
const lastImportIndex = blogPostsContent.lastIndexOf("import ");
const endOfLastImport = blogPostsContent.indexOf(';', lastImportIndex) + 1;
const beforeImports = blogPostsContent.substring(0, endOfLastImport);
const afterImports = blogPostsContent.substring(endOfLastImport);

blogPostsContent = beforeImports + newImports + afterImports;

// Add the broker charts to the forex broker review content
const brokerChartsContent = `

![Top 5 Forex Brokers 2025 Rankings](\${topBrokersRankingChart})

## 🏆 Top 5 Forex Brokers 2025 - Editor's Choice

![Complete Broker Rankings Comparison](\${brokerComparisonTableChart})

## Complete Broker Rankings 2025`;

// Insert the charts after the initial title in the forex broker content
blogPostsContent = blogPostsContent.replace(
    '## 🏆 Top 5 Forex Brokers 2025 - Editor\'s Choice',
    brokerChartsContent
);

// Add images to freelancer article
const freelancerImages = `

![Freelancer Payment Methods 2025](\${freelancerPaymentMethods})

## Understanding Multi-Currency Payments

![Freelancer Payment Options](\${freelancerPaymentOptions})

## Optimizing Payment Processing`;

blogPostsContent = blogPostsContent.replace(
    'Understanding Multi-Currency Payments',
    freelancerImages.replace('## Understanding Multi-Currency Payments', 'Understanding Multi-Currency Payments')
);

// Add images to digital nomad article
const nomadImages = `

![Digital Nomad Remote Work Lifestyle](\${nomadRemoteWorkLifestyle})

## Multi-Currency Budgeting Strategies

![Nomad Money Management](\${nomadMoneyManagement})

## Currency Risk Management for Nomads`;

blogPostsContent = blogPostsContent.replace(
    'Multi-Currency Budgeting Strategies',
    nomadImages.replace('## Multi-Currency Budgeting Strategies', 'Multi-Currency Budgeting Strategies')
);

// Add images to business hedging article
const businessImages = `

![Business Currency Hedging Strategies](\${businessHedgingStrategies})

## Understanding Currency Risk

![Forex Risk Management](\${forexRiskManagement})

## Implementing Hedging Strategies`;

blogPostsContent = blogPostsContent.replace(
    'Understanding Currency Risk',
    businessImages.replace('## Understanding Currency Risk', 'Understanding Currency Risk')
);

// Add images to travel money article
const travelImages = `

![Travel Money Management](\${travelMoneyManagement})

## Creating Your Travel Budget

![Travel Budget Template](\${travelBudgetTemplate})

## Currency Exchange Strategies`;

blogPostsContent = blogPostsContent.replace(
    'Creating Your Travel Budget',
    travelImages.replace('## Creating Your Travel Budget', 'Creating Your Travel Budget')
);

// Write the updated file
fs.writeFileSync('/home/ubuntu/currency/src/data/blogPosts.ts', blogPostsContent);
console.log('✅ Successfully added all new images and charts to articles!');

