import { TRANSLATIONS } from "./i18n";

/* Role-specific text and API paths, parameterized by active language */
export function getRoleConfig(role, lang = "en") {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isFarmer = role === "Farmer";

  return {
    mine: isFarmer ? "lots" : "demand",
    other: isFarmer ? "demand" : "lots",
    roleName: isFarmer ? dict.role_farmer : dict.role_buyer,
    nav: {
      post: isFarmer ? dict.nav_post_farmer : dict.nav_post_buyer,
      mine: isFarmer ? dict.nav_mine_farmer : dict.nav_mine_buyer,
      lots: dict.nav_browse_buyer,
      demand: dict.nav_browse_farmer,
      browse: isFarmer ? dict.nav_browse_farmer : dict.nav_browse_buyer,
    },
    postTitle: isFarmer ? dict.post_farmer_title : dict.post_buyer_title,
    postHint: isFarmer ? dict.post_farmer_hint : dict.post_buyer_hint,
    priceLabel: isFarmer ? dict.farmer_price_label : dict.buyer_price_label,
    submit: isFarmer ? dict.publish_farmer_submit : dict.publish_buyer_submit,
    published: isFarmer ? dict.lot_published : dict.demand_published,
    mineTitle: isFarmer ? dict.nav_mine_farmer : dict.nav_mine_buyer,
    mineEmpty: isFarmer ? dict.farmer_mine_empty : dict.buyer_mine_empty,
    browseTitle: isFarmer ? dict.nav_browse_farmer : dict.nav_browse_buyer,
    browseHint: isFarmer ? dict.post_buyer_hint : dict.post_farmer_hint,
    browseEmpty: isFarmer ? dict.farmer_browse_empty : dict.buyer_browse_empty,
    remove: isFarmer ? dict.delete_lot : dict.cancel_demand,
    removed: isFarmer ? dict.lot_deleted : dict.demand_cancelled,
    ownerWord: isFarmer ? dict.role_buyer : dict.role_farmer,
    priceWord: isFarmer ? dict.farmer_asks : dict.buyer_offers,
    otherPriceWord: isFarmer ? dict.farmer_offers : dict.buyer_asks,
    cropPlaceholder: dict.crop_placeholder,
  };
}

/* Backward compatibility fallback */
export const ROLE = {
  Farmer: getRoleConfig("Farmer", "en"),
  Buyer: getRoleConfig("Buyer", "en"),
};
