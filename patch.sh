# ====================================
# ==== Patch EntryPoint Contracts ====
# ====================================

# Patch EntryPoint v0.6
find . -type f -exec sed -i 's/0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789/0x027b465F1Cfc3B2A70611587d3eE06362AA14E3a/Ig' {} +

# Patch EntryPoint v0.7
find . -type f -exec sed -i 's/0x0000000071727De22E5E9d8BAf0edAc6f37da032/0xEB0a534440145D5A3aa512352FDDCf85453182b9/Ig' {} +

# ==============================
# ==== Patch Safe Contracts ====
# ==============================

# Patch for SAFE PROXY FACTORY
find . -type f -exec sed -i 's/0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67/0xcAF988CE2d86060da7d7Ad61077C298cC2aF3FA9/Ig' {} +

# Patch for SAFE SINGLETON
find . -type f -exec sed -i 's/0x41675C099F32341bf84BFc5382aF534df5C7461a/0x90205Ab140b744973dAa754D028016812AD02eF7/Ig' {} +

# Patch for MULTI SEND
find . -type f -exec sed -i 's/0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526/0xC9E16Ca1413D76E3FBdc849028C711Af3F2c9f8A/Ig' {} +

# Patch for MULTI SEND CALL ONLY
find . -type f -exec sed -i 's/0x9641d764fc13c8B624c04430C7356C1C7C8102e2/0xA430AEE546cfA321E1d1ED6BAD2ccD6857744F65/Ig' {} +

# [V06] Patch for SAFE MODULE SETUP
find . -type f -exec sed -i 's/0x8EcD4ec46D4D2a6B64fE960B3D64e8B94B2234eb/0x8D1e42A0d45951875fDc38B7a76E03745Ce35D3d/Ig' {} +

# [V06] Patch for SAFE 4337 MODULE
find . -type f -exec sed -i 's/0xa581c4A4DB7175302464fF3C06380BC3270b4037/0x589C6DFEA37B1ceF62A81a8Cc55f7ef827cF6AF8/Ig' {} +

# [V07] Patch for SAFE MODULE SETUP
find . -type f -exec sed -i 's/0x2dd68b007B46fBe91B9A7c3EDa5A7a1063cB5b47/0x76Aa63a59f211122EDE2A1C692078803B9E42A10/Ig' {} +

# [V07] Patch for SAFE 4337 MODULE
find . -type f -exec sed -i 's/0x75cf11467937ce3F2f357CE24ffc3DBF8fD5c226/0x8F911b3Ab1864Ccb96B57F7758543aEce200Ca72/Ig' {} +
