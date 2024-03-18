{
  description = "STB Engine";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
  let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in
  {
    devShells.${system}.default = pkgs.mkShell {
      nativeBuildInputs = with pkgs; [
        nodePackages.pnpm
        corepack
      ];
    };
    apps.${system}.default = {
      type = "app";
      program = "${pkgs.nodePackages.pnpm}/bin/pnpm";
    };
    packages.${system}.default = pkgs.stdenv.mkDerivation {
      name = "std-engine";
      buildInputs = with pkgs; [
        nodejs
        nodePackages.pnpm
      ];
      srcs = [ ./. ];
      buildPhase = ''
      export NODE_TLS_REJECT_UNAUTHORIZED=0
      mkdir $out
      export PNPM_HOME=$out/pnpm
      pnpm install --frozen-lockfile
      pnpm build
      cp -r _site $out
      env
      '';
    };
  };
}
