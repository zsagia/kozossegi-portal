# KozossegiPortal - Specification

1. Közösségi oldal készítése

Készíts egy egyszerű webes közösségi oldalt, amelynek funkciói:
- bárki regisztrálhat, a regisztrációkor bekérendő adatok: név, email cím, jelszó
- nem kell email értesítés, az admin felhasználó bírálja el a regisztrációs igényeket
- az engedélyezett felhasználók az email címük és jelszavuk beírásával beléphetnek a rendszerbe
- a rendszerben szereplő felhasználókat listázhatják és ismerősnek jelölhetik. Az ismerősnek jelölésről a másik felhasználó értesítést kap. Ha legközelebb belép, eldöntheti, hogy elfogadja-e az ismerősnek jelölést (vissza is utasíthatja). Mindkét esetben a jelölő felhasználó erről értesítést kap.
- a felhasználók üzeneteket küldhetnek egymásnak vagy mindenkinek.

A fejlesztés során kötelezően használandó programnyelvek, eszközök:
- Angular 2+
- javasolt bármely git platformon a kód megosztásra
- Adatok tárolása elégséges in-memory módon is
